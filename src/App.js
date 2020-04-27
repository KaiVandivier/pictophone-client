import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import './App.css';

const ENDPOINT = "http://localhost:4000";

function App() {
  const [ message, setMessage ] = useState("Trying to connect...");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("message", (data) => {
      console.log(data);
      setMessage(data.message);
    })
  }, []); // The empty array argument prevents this from running multiple times (which creates mulltiple sockets)

  return (
    <h1>
      {message}
    </h1>
  );
}

export default App;
