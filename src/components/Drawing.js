import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { SocketContext } from "../App";
import utilStyles from "../styles/utils.module.css";
import Timer from "./Timer";

// TODO:
// CORE: Vulnerable to window size change
// Feat: Change pen size
// Feat: Smooth lines?

export default function Drawing(props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [radius, setRadius] = useState(3);
  const [canvasOffsetX, setCanvasOffsetX] = useState(0);
  const [canvasOffsetY, setCanvasOffsetY] = useState(0);
  const [ctx, setCtx] = useState(null);
  const canvas = useRef(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const canvasCtx = canvas.current.getContext("2d");
    canvas.current.width = "640"; //window.innerWidth
    canvas.current.height = "480"; // window.innerHeight
    canvasCtx.strokeStyle = "#222";
    canvasCtx.fillStyle = "#222";
    canvasCtx.lineJoin = "round";
    canvasCtx.lineCap = "round";
    canvasCtx.lineWidth = 2 * radius;
    setCtx(canvasCtx);
    setCanvasOffsetX(canvas.current.offsetLeft);
    setCanvasOffsetY(canvas.current.offsetTop);

    socket.emit("drawing-phase-loaded");
    socket.once("drawing-time-up", () => {
      socket.emit("image-data", canvas.current.toDataURL());
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function draw(e) {
    if (!isDrawing) return; // stop the fn from running when they are not moused down
    ctx.beginPath();
    ctx.moveTo(lastX, lastY); // start of path
    ctx.lineTo(e.pageX - canvasOffsetX, e.pageY - canvasOffsetY); // end of path
    ctx.stroke();
    setLastX(e.pageX - canvasOffsetX);
    setLastY(e.pageY - canvasOffsetY);
  }

  function drawDot(e) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      e.pageX - canvasOffsetX,
      e.pageY - canvasOffsetY,
      radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  }

  function switchToPen() {
    setRadius(3);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#222";
    ctx.fillStyle = "#222";
  }

  function switchToEraser() {
    setRadius(10);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
  }

  return (
    <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
      <h1 className={utilStyles.headingLg}>Draw: "{props.word}"</h1>
      <div>
        <button className={utilStyles.smallButton} onClick={switchToPen}>Pen</button>
        <button className={utilStyles.smallButton} onClick={switchToEraser}>Eraser</button>
        <button className={utilStyles.smallButton} onClick={clearCanvas}>Clear All</button>
        <Timer />
      </div>

      <canvas
        ref={canvas}
        className={utilStyles.drawing}
        onMouseDown={(e) => {
          setIsDrawing(true);
          setLastX(e.pageX - canvasOffsetX);
          setLastY(e.pageY - canvasOffsetY);
          drawDot(e);
        }}
        onMouseMove={draw}
        onMouseUp={() => {
          setIsDrawing(false);
        }}
        onMouseOut={() => {
          setIsDrawing(false);
        }}
      />
    </div>
  );
}

Drawing.propTypes = {
  word: PropTypes.string.isRequired
}
