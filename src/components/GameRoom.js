import React, { useState, useContext, useEffect } from "react";
import Waiting from "./Waiting";
import Countdown from "./Countdown";
import Drawing from "./Drawing";
import WordChoosing from "./WordChoosing";
import Guessing from "./Guessing";
import { SocketContext } from "../App";

export default function GameRoom(props) {
  const socket = useContext(SocketContext);
  const [phaseComponent, setPhaseComponent] = useState(
    <Waiting />
  );

  useEffect(() => {
    socket.once("choose-word", loadWordChoosing);
    socket.on("countdown", loadCountdown);

    return () => {
      socket.off("choose-word");
      socket.off("countdown");
    };
  });

  function loadWordChoosing(words) {
    socket.once("load-drawing-phase", loadDrawingPhase);
    setPhaseComponent(<WordChoosing words={words} />);
  }

  function loadCountdown(message) {
    setPhaseComponent(<Countdown message={message} />);
  }

  function loadDrawingPhase(phaseData, ack) {
    socket.off("load-replay"); // TODO: Is there a better solution to control flow after guessing phase?
    socket.once("load-guessing-phase", loadGuessingPhase);
    window.scrollTo(0, 0);
    setPhaseComponent(<Drawing onLoad={ack} word={phaseData.data} />);
  }

  function loadGuessingPhase(phaseData, ack) {
    socket.once("load-drawing-phase", loadDrawingPhase);
    socket.once("load-replay", loadReplay);
    window.scrollTo(0, 0);
    setPhaseComponent(<Guessing onLoad={ack} dataURL={phaseData.data} previousPlayer={phaseData.playerName} />);
  }

  function loadReplay(gameReplayData) {
    socket.off("load-drawing-phase"); // TODO: A better solution?
    socket.once("choose-word", loadWordChoosing);
    window.scrollTo(0, 0);
    setPhaseComponent(<Waiting gameReplayData={gameReplayData} />);
  }

  return phaseComponent;
}
