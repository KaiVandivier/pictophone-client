import React, { useState } from "react";
import socketIOClient from "socket.io-client";
import { endpoint, prodEndpoint } from "./config";
import Waiting from "./components/Waiting";
import Drawing from "./components/Drawing";
import WordChoosing from "./components/WordChoosing";
import Guessing from "./components/Guessing";
import Replay from "./components/Replay";
// import {testReplayData} from "./lib/testUtils";

const ENDPOINT =
  process.env.NODE_ENV === "production" ? prodEndpoint : endpoint;
const socket = socketIOClient(ENDPOINT);
export const SocketContext = React.createContext(socket);

function App() {
  const [phaseComponent, setPhaseComponent] = useState(
    <Waiting onClick={sendReady} />
  );

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
    socket.off("load-replay"); // TODO: Is there a better solution to control flow after guessing phase?
    socket.once("load-guessing-phase", loadGuessingPhase);
    setPhaseComponent(<Drawing word={word} />);
  }

  function loadGuessingPhase({ dataURL }) {
    socket.once("load-drawing-phase", loadDrawingPhase);
    socket.once("load-replay", loadReplay);
    setPhaseComponent(<Guessing dataURL={dataURL} />);
  }

  function loadReplay({ replayData }) {
    socket.off("load-drawing-phase"); // TODO: A better solution?
    setPhaseComponent(<Replay replayData={replayData} />);
  }

  return (
    <SocketContext.Provider value={socket}>
      {phaseComponent}
    </SocketContext.Provider>
  );
}

export default App;
