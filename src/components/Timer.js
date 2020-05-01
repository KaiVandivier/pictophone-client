import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../App";

export default function Timer() {
  const [time, setTime] = useState(0);
  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log("Adding time listener");
    socket.on("time", ({ time }) => setTime(time))
    return () => {
      console.log("Removing time listener");
      socket.off("time");
    }
  }, [])

  return (
    <span>Time left: {time}</span>
  )
};
