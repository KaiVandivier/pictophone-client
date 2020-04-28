import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { endpoint, prodEndpoint } from "./config";
import Canvas from "./components/Canvas";
import "./App.css";

const ENDPOINT =
  process.env.NODE_ENV === "production" ? prodEndpoint : endpoint;

function App() {
  const [message, setMessage] = useState("Trying to connect...");
  const [secs, setSecs] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
    newSocket.on("message", (data) => {
      console.log(data);
      setMessage(data.message);
    });
    newSocket.on("time", (data) => {
      setSecs(data.time);
    });
    setSocket(newSocket);
  }, []);
  // The empty array argument prevents this from unduly running multiple times

  function startTimer() {
    console.log(socket);
    socket.emit("start-timer");
    console.log("start-timer event sent");
  }

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={startTimer}>Start timer</button>
      <h2>Time: {secs}</h2>
      <Canvas />
    </div>
  );
}

export default App;
