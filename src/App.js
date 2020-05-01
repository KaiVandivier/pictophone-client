import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { endpoint, prodEndpoint } from "./config";
import Waiting from "./components/Waiting";
import Drawing from "./components/Drawing";
import WordChoosing from "./components/WordChoosing";
import Guessing from "./components/Guessing";

const ENDPOINT =
  process.env.NODE_ENV === "production" ? prodEndpoint : endpoint;
const socket = socketIOClient(ENDPOINT);
export const SocketContext = React.createContext(socket);

function App() {
  const [secs, setSecs] = useState(0);
  const [phaseComponent, setPhaseComponent] = useState(
    <Waiting onClick={sendReady} />
  );

  useEffect(() => {
    socket.on("time", (data) => {
      setSecs(data.time);
    });
  }, []);
  // The empty array argument prevents this from unduly running multiple times

  function sendReady() {
    socket.once("choose-word", loadWordChoosing);
    socket.emit("ready");
  }

  function loadWordChoosing({ words }) {
    socket.once("load-drawing-phase", loadDrawingPhase);
    setPhaseComponent(
      <WordChoosing
        words={words}
        submitFn={(word) => socket.emit("word-chosen", { word })}
      />
    );
  }

  function loadDrawingPhase({ word }) {
    // Note that there is already a time handler from `useEffect`
    // socket.on("time"); // TODO: Handle time; maybe pass to Drawing
    socket.once("load-guessing-phase", loadGuessingPhase);

    setPhaseComponent(<Drawing word={word} />);
  }

  function loadGuessingPhase({ dataURL }) {
    // TODO: Handle socket.on("time")
    if (true) {
      // TODO: Listen for "replay" too
      socket.once("load-drawing-phase", loadDrawingPhase);
    } else {
      socket.once("load-replay", loadReplay);
    }
    setPhaseComponent(<Guessing dataURL={dataURL} />);
  }

  function loadReplay() {
    setPhaseComponent(<h1>Hooray! Game cycle done!</h1>);
  }

  return (
    <SocketContext.Provider value={socket}>
      <p>Time: {secs}</p>

      {phaseComponent}
    </SocketContext.Provider>
  );
}

export default App;
