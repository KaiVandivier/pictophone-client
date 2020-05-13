import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../App";
import utilStyles from "../styles/utils.module.css";

export default function Timer({ text, highlightTimeLow }) {
  const [time, setTime] = useState(0);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("time", setTime)
    return () => {
      socket.off("time");
    }
  }, [socket])

  const timeLowStyles = {
    color: time > 10 ? "black" : "#d00"
  }

  return (
    <span className={utilStyles.headingLg} style={highlightTimeLow ? timeLowStyles : null}>{text} {time}</span>
  )
};
