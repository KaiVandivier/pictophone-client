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
  const canvas = useRef(null);
  const requestRef = useRef();
  const drawingRef = useRef(false);
  const ctxRef = useRef();
  const lastPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });

  const socket = useContext(SocketContext);

  useEffect(() => {
    canvas.current.width = Math.min(
      document.documentElement.clientWidth - 20,
      400
    ); //window.innerWidth
    canvas.current.height = Math.min(
      document.documentElement.clientHeight - 100,
      600
    ); // window.innerHeight

    ctxRef.current = canvas.current.getContext("2d");
    ctxRef.current.strokeStyle = "#222";
    ctxRef.current.fillStyle = "#222";
    ctxRef.current.lineJoin = "round";
    ctxRef.current.lineCap = "round";
    ctxRef.current.lineWidth = 2 * radius;

    // Confirm loaded
    onLoad(true);
    // Prepare to respond with data
    socket.once("get-data", (ack) => ack(canvas.current.toDataURL()));

    requestRef.current = window.requestAnimationFrame(drawLoop);
    window.addEventListener("mouseup", stopDrawing);
    window.addEventListener("touchend", stopDrawing);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("mouseup", stopDrawing);
      window.removeEventListener("touchend", stopDrawing);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        ? getTouchPos(canvas.current, e)
        : getMousePos(canvas.current, e);
    ctxRef.current.save();
    ctxRef.current.beginPath();
    ctxRef.current.arc(currentPos.x, currentPos.y, radius, 0, Math.PI * 2);
    ctxRef.current.fill();
    ctxRef.current.restore();
  }

  function clearCanvas() {
    if (!window.confirm("Clear canvas?")) return;
    ctxRef.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
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
        ref={canvas}
        className={utilStyles.drawing}
        onMouseDown={(e) => {
          e.preventDefault(); // fixes selecting text on page
          drawDot(e);
          const mousePos = getMousePos(canvas.current, e);
          lastPosRef.current = { ...mousePos };
          currentPosRef.current = { ...mousePos };
          drawingRef.current = true;
        }}
        onMouseMove={(e) => {
          currentPosRef.current = getMousePos(canvas.current, e);
        }}
        onTouchStart={(e) => {
          drawDot(e);
          e.preventDefault();
          const touchPos = getTouchPos(canvas.current, e);
          lastPosRef.current = { ...touchPos };
          currentPosRef.current = { ...touchPos };
          drawingRef.current = true;
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          currentPosRef.current = getTouchPos(canvas.current, e);
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
