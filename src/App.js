import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { endpoint, prodEndpoint } from "./config";
import Canvas from "./components/Canvas";
import "./App.css";

const ENDPOINT =
  process.env.NODE_ENV === "production" ? prodEndpoint : endpoint;

function App() {
  const [message, setMessage] = useState("Trying to connect...");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("message", (data) => {
      console.log(data);
      setMessage(data.message);
    });
  }, []); // The empty array argument prevents this from running multiple times (which creates mulltiple sockets)

  return (
  <div>
    <h1>{message}</h1>
    <Canvas />
  </div>
  );
}

export default App;
