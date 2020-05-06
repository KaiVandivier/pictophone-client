import React, { useState, useContext, useEffect } from "react";
import Waiting from "./Waiting";
import Drawing from "./Drawing";
import WordChoosing from "./WordChoosing";
import Guessing from "./Guessing";
import Replay from "./Replay";
import { SocketContext } from "../App";

// TODO: Move this to a `constants` file
// const phases = Object.freeze({
//   WAITING: "waiting",
//   CHOOSING_WORD: "choosing-word",
//   DRAWING: "drawing",
//   GUESSING: "guessing",
//   REPLAY: "replay",
// });

export default function GameRoom(props) {
  const socket = useContext(SocketContext);
  const [phaseComponent, setPhaseComponent] = useState(
    <Waiting onClick={sendReady} />
  );

  useEffect(() => {
    socket.once("choose-word", loadWordChoosing);
  });

  // TODO: Change this logic to handle "toggleReady" and "gameStart"
  function sendReady() {
    // socket.once("choose-word", loadWordChoosing);
    socket.emit("ready");
  }

  function loadWordChoosing(words) {
    socket.once("load-drawing-phase", loadDrawingPhase);
    setPhaseComponent(<WordChoosing words={words} />);
  }

  function loadDrawingPhase(word) {
    socket.off("load-replay"); // TODO: Is there a better solution to control flow after guessing phase?
    socket.once("load-guessing-phase", loadGuessingPhase);
    setPhaseComponent(<Drawing word={word} />);
  }

  function loadGuessingPhase(dataURL) {
    socket.once("load-drawing-phase", loadDrawingPhase);
    socket.once("load-replay", loadReplay);
    setPhaseComponent(<Guessing dataURL={dataURL} />);
  }

  function loadReplay() {
    socket.off("load-drawing-phase"); // TODO: A better solution?
    setPhaseComponent(<Replay />);
  }

  // const phaseComponents = {
  //   [phases.WAITING]: <Waiting onClick={sendReady} />,
  //   [phases.CHOOSING_WORD]: <WordChoosing words={phaseData} submitFn={(word) => socket.emit("word-chosen", { word })} />,
  //   [phases.DRAWING]: <Drawing word={phaseData} />,
  //   [phases.GUESSING]: <Guessing dataURL={phaseData} />,
  //   [phases.REPLAY]: <Replay replayData={phaseData} />
  // }

  return phaseComponent;
}
