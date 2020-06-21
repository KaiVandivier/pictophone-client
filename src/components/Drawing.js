import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";

import { SocketContext } from "../App";
import Timer from "./Timer";
import Button from "./Button";

import utilStyles from "../styles/utils.module.css";
import styles from "../styles/Drawing.module.css";

// TODO:
// Cleanliness: would animation work with `state` and setting state with functions to persist values between animation?
// Feat: Change pen size
// Feat: Smooth lines?

const tools = {
  PEN: "PEN",
  ERASER: "ERASER",
};

export default function Drawing({ word, onLoad }) {
  const [radius, setRadius] = useState(3);
  const [activeTool, setActiveTool] = useState(tools.PEN);

  // use "refs" here to persist values between animation frames
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const drawingRef = useRef(false);
  const ctxRef = useRef();
  const lastPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });

  const socket = useContext(SocketContext);

  useEffect(() => {
    // Set canvas dimensions
    const { clientWidth, clientHeight } = document.documentElement;
    const maxHeight = clientHeight - 100;
    canvasRef.current.height = maxHeight;
    canvasRef.current.width = Math.min(
      Math.round(clientWidth * 0.9),
      Math.round(maxHeight * 1.33)
    );

    ctxRef.current = canvasRef.current.getContext("2d");
    ctxRef.current.strokeStyle = "#222";
    ctxRef.current.fillStyle = "#222";
    ctxRef.current.lineJoin = "round";
    ctxRef.current.lineCap = "round";
    ctxRef.current.lineWidth = 2 * radius;

    // Confirm loaded
    onLoad(true);
    // Prepare to respond with data to end-of-round signal
    socket.once("get-data", (ack) => ack(canvasRef.current.toDataURL()));

    // Prevent scrolling and highlighting when touching the canvas
    document.body.addEventListener("touchstart", preventTouchDefault, false);
    document.body.addEventListener("touchend", preventTouchDefault, false);
    document.body.addEventListener("touchmove", preventTouchDefault, false);

    // Start animation loop
    requestRef.current = window.requestAnimationFrame(drawLoop);

    // Relevant listeners
    window.addEventListener("mouseup", stopDrawing);
    window.addEventListener("touchend", stopDrawing);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("mouseup", stopDrawing);
      window.removeEventListener("touchend", stopDrawing);
      document.body.removeEventListener(
        "touchstart",
        preventTouchDefault,
        false
      );
      document.body.removeEventListener("touchend", preventTouchDefault, false);
      document.body.removeEventListener(
        "touchmove",
        preventTouchDefault,
        false
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function preventTouchDefault(e) {
    if (e.target === canvasRef.current) e.preventDefault();
  }

  function stopDrawing() {
    drawingRef.current = false;
  }

  // Repeatedly animate
  function drawLoop() {
    renderCanvas();
    requestRef.current = window.requestAnimationFrame(drawLoop);
  }

  // Draw to the canvas
  function renderCanvas() {
    if (!drawingRef.current) return;
    if (
      lastPosRef.current.x === currentPosRef.current.x &&
      lastPosRef.current.y === currentPosRef.current.y
    )
      return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctxRef.current.lineTo(currentPosRef.current.x, currentPosRef.current.y);
    ctxRef.current.stroke();
    lastPosRef.current = { ...currentPosRef.current };
  }

  // Get the position of the mouse relative to the canvas
  function getMousePos(canvasDom, mouseEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
      x: Math.round(mouseEvent.clientX - rect.left),
      y: Math.round(mouseEvent.clientY - rect.top),
    };
  }

  // Get the position of a touch relative to the canvas
  function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: Math.round(touchEvent.touches[0].clientX - rect.left),
      y: Math.round(touchEvent.touches[0].clientY - rect.top),
    };
  }

  function drawDot(e) {
    const currentPos =
      e.type === "touchstart"
        ? getTouchPos(canvasRef.current, e)
        : getMousePos(canvasRef.current, e);
    ctxRef.current.save();
    ctxRef.current.beginPath();
    ctxRef.current.arc(currentPos.x, currentPos.y, radius, 0, Math.PI * 2);
    ctxRef.current.fill();
    ctxRef.current.restore();
  }

  function clearCanvas() {
    if (!window.confirm("Clear canvas?")) return;
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  }

  function switchToPen() {
    setRadius(3);
    setActiveTool(tools.PEN);
    ctxRef.current.lineWidth = 6;
    ctxRef.current.strokeStyle = "#222";
    ctxRef.current.fillStyle = "#222";
  }

  function switchToEraser() {
    setRadius(10);
    setActiveTool(tools.ERASER);
    ctxRef.current.lineWidth = 20;
    ctxRef.current.strokeStyle = "#fff";
    ctxRef.current.fillStyle = "#fff";
  }

  return (
    <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
      <h1 className={`${utilStyles.heading} ${styles.heading}`}>
        Your word: <span className={utilStyles.word}>&ldquo;{word}&rdquo;</span>
      </h1>

      <div className={styles.toolbar}>
        <div>
          <Button
            small
            noShadow
            color={activeTool === tools.PEN ? "orange" : null}
            onClick={switchToPen}
          >
            Pen
          </Button>

          <Button
            small
            noShadow
            color={activeTool === tools.ERASER ? "orange" : null}
            onClick={switchToEraser}
          >
            Eraser
          </Button>

          <Button small noShadow onClick={clearCanvas}>
            Clear All
          </Button>
        </div>
        <div className={styles.timer}>
          <Timer highlightTimeLow />
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className={utilStyles.drawing}
        onMouseDown={(e) => {
          e.preventDefault(); // fixes selecting text on page
          drawDot(e);
          const mousePos = getMousePos(canvasRef.current, e);
          lastPosRef.current = { ...mousePos };
          currentPosRef.current = { ...mousePos };
          drawingRef.current = true;
        }}
        onMouseMove={(e) => {
          currentPosRef.current = getMousePos(canvasRef.current, e);
        }}
        onTouchStart={(e) => {
          drawDot(e);
          e.preventDefault();
          const touchPos = getTouchPos(canvasRef.current, e);
          lastPosRef.current = { ...touchPos };
          currentPosRef.current = { ...touchPos };
          drawingRef.current = true;
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          currentPosRef.current = getTouchPos(canvasRef.current, e);
        }}
        onTouchEnd={(e) => e.preventDefault()}
        // `mouseUp` listener moved to `window`
      />
    </div>
  );
}

Drawing.propTypes = {
  word: PropTypes.string.isRequired,
  onLoad: PropTypes.func.isRequired,
};
