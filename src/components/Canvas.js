import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/canvas.module.css";

export default function Canvas(props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [hue, /* setHue */] = useState(180);
  const [radius, /* setRadius */] = useState(3);
  const [canvasOffsetX, setCanvasOffsetX] = useState(0);
  const [canvasOffsetY, setCanvasOffsetY] = useState(0);
  const [ctx, setCtx] = useState(null);
  const canvas = useRef(null);

  useEffect(() => {
    const canvasCtx = canvas.current.getContext("2d");
    canvas.current.width = "800"; //window.innerWidth
    canvas.current.height = "600"; // window.innerHeight
    canvasCtx.strokeStyle = "#BADA55";
    canvasCtx.lineJoin = "round";
    canvasCtx.lineCap = "round";
    canvasCtx.lineWidth = 2 * radius;
    setCtx(canvasCtx);
    setCanvasOffsetX(canvas.current.offsetLeft);
    setCanvasOffsetY(canvas.current.offsetTop);
  }, [radius]);

  function draw(e) {
    if (!isDrawing) return; // stop the fn from running when they are not moused down
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
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
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.arc(e.pageX - canvasOffsetX, e.pageY - canvasOffsetY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  return (
    <canvas
      ref={canvas}
      className={styles.canvas}
      onMouseDown={(e) => {
        setIsDrawing(true);
        setLastX(e.pageX - canvasOffsetX);
        setLastY(e.pageY - canvasOffsetY);
        drawDot(e)
      }}
      onMouseMove={draw}
      onMouseUp={() => {
        setIsDrawing(false);
      }}
      onMouseOut={() => {
        setIsDrawing(false);
      }}
    ></canvas>
  );
}
