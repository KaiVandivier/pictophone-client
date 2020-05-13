const msgs = Object.freeze({
  MESSAGE: "message",
  CONTINUE: "continue",
  GET_ROOMS: "get-rooms",
  JOIN_ROOM: "join-room",
  CREATE_ROOM: "create-room",
  LEAVE_ROOM: "leave-room",
  ALL_ROOMS: "all-rooms",
  ROOM_UPDATE: "room-update",
  TOGGLE_READY: "toggle-ready",
  START_GAME: "start-game",

  // ready: "ready",
  // loadWordChoosing: "choose-word",
  // wordChoice: "word-chosen",
  // loadDrawingPhase: "load-drawing-phase",
  // drawingPhaseLoaded: "drawing-phase-loaded",
  // time: "time",
  // drawingTimeUp: "drawing-time-up",
  // imageData: "image-data",
  // loadGuessingPhase: "load-guessing-phase",
  // guessingPhaseLoaded: "guessing-phase-loaded",
  // guessingTimeUp: "guessing-time-up",
  // guessData: "guess-data",
  // loadReplay: "load-replay",
});

export function checkSchemaMatch(serverSchema) {
  // TODO: check LENGTH and throw errors
  return msgs.keys.every((key) => serverSchema[key] === msgs[key]);
}

export default msgs;
