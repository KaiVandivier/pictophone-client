const messages = {
  ready: "ready",
  loadWordChoosing: "choose-word",
  wordChoice: "word-chosen",
  loadDrawingPhase: "load-drawing-phase",
  drawingPhaseLoaded: "drawing-phase-loaded",
  time: "time",
  drawingTimeUp: "drawing-time-up",
  imageData: "image-data",
  loadGuessingPhase: "load-guessing-phase",
  guessingPhaseLoaded: "guessing-phase-loaded",
  guessingTimeUp: "guessing-time-up",
  guessData: "guess-data",
  loadReplay: "load-replay",
};

export function checkSchemaMatch(serverSchema) {
  // TODO: check LENGTH and throw errors
  return messages.keys.every((key) => serverSchema[key] === messages[key]);
}

export default messages;
