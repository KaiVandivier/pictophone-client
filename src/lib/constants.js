const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 360;

const phases = Object.freeze({
  WAITING: "WAITING",
  WORD_CHOOSING: "WORD_CHOOSING",
  DRAWING: "DRAWING",
  GUESSING: "GUESSING",
  REPLAY: "REPLAY",
});

const dataTypes = Object.freeze({
  WORD: "word",
  DRAWING: "drawing",
  GUESSING: "guess",
})

export {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  phases,
  dataTypes
}