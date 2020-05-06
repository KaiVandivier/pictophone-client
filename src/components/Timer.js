import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../App";

export default function Timer() {
  const [time, setTime] = useState(0);
  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log("Adding time listener");
    socket.on("time", setTime)
    return () => {
      console.log("Removing time listener");
      socket.off("time");
    }
  }, [socket])

  return (
    <span>Time left: {time}</span>
  )
};
