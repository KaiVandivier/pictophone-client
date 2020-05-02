import React from "react";
import PropTypes from "prop-types";
import utilStyles from "../styles/utils.module.css";

export default function Replay({ replayData }) {

  const { word, rounds } = replayData
  return (
    <div className={utilStyles.center}>
      <h1>Replay for player!</h1>
      <h2>The word was: {word}</h2>
      {rounds.map(({ drawing, guess }) => (
        <>
          <h2>Player drew:</h2>
          <img src={drawing} alt="Player drawing" className={utilStyles.drawing} />
          <h2>Player guessed: {guess}</h2>
        </>
      ))}
    </div>
  )
}

// TODO: More specific about shape as it develops
Replay.propTypes = {
  replayData: PropTypes.object
}
