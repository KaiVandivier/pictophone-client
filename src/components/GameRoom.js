import React, { useState, useContext, useEffect } from "react";
import Waiting from "./Waiting";
import Drawing from "./Drawing";
import WordChoosing from "./WordChoosing";
import Guessing from "./Guessing";
import Replay from "./Replay";
import { SocketContext } from "../App";

// TODO: Do we need to receive more about the room than the id?
// TODO: Also, propTypes

// TODO: Move this to a `constants` file
const phases = Object.freeze({
  WAITING: "waiting",
  CHOOSING_WORD: "choosing-word",
  DRAWING: "drawing",
  GUESSING: "guessing",
  REPLAY: "replay",
});

export default function GameRoom({ room }) {
  const socket = useContext(SocketContext);
  const [phaseComponent, setPhaseComponent] = useState(
    <Waiting onClick={sendReady} />
  );
  // const [phaseData, setPhaseData] = useState(null); // testing

  useEffect(() => {
    socket.once("choose-word", loadWordChoosing);
  })

  // TODO: Change this logic to handle "toggleReady" and "gameStart"
  function sendReady() {
    // socket.once("choose-word", loadWordChoosing);
    socket.emit("ready");
  }

  function loadWordChoosing({ words }) {
    // setPhaseData(words) // testing
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

  // let phaseComponent;
  // switch (room.phase) {
  //   case phases.WAITING:
  //     phaseComponent = <Waiting onClick={sendReady} room={room} />;
  //     break;
  //   case phases.CHOOSING_WORD:
  //     // TODO: get the WORDS data; maybe get generic `phaseData` in state
  //     break;
  //   default:
  //     phaseComponent = <p>Oops there's no phase here!</p>;
  // }

  return phaseComponent;
}
