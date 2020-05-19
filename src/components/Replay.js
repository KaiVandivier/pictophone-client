import React from "react";
import PropTypes from "prop-types";

import { dataTypes } from "../lib/constants";

import utilStyles from "../styles/utils.module.css";

export default function Replay({ gameReplayData }) {
  return (
    <section className={`${utilStyles.center}`}>
      <h1 className={utilStyles.headingLg}>
        Round over! Let's see what happened!
      </h1>
      <hr className={utilStyles.hr} />
      {/* Loop over players: */}
      {gameReplayData.map((player) => {
        return (
          <div className={utilStyles.center} key={player.id}>
            {player.replayData.map(({ type, data, playerName }) => {
              if (type === dataTypes.WORD) {
                return (
                  <h1 className={utilStyles.heading}>
                    <em>{playerName}'s word was: </em>
                    <strong>"{data}"</strong>
                  </h1>
                );
              }
              if (type === dataTypes.GUESSING) {
                return (
                  <h2 className={utilStyles.heading} key={playerName}>
                    {playerName} guessed: <strong>"{data}"</strong>
                  </h2>
                );
              }
              if (type === dataTypes.DRAWING) {
                return (
                  <div className={utilStyles.center} key={playerName}>
                    <h2 className={utilStyles.heading}>{playerName} drew:</h2>
                    <img
                      src={data}
                      alt="Player drawing"
                      className={utilStyles.drawing}
                    />
                  </div>
                );
              }
              return <p>Oops! I don't recognize that data type :(</p>;
            })}
            <hr className={utilStyles.hr} />
          </div>
        );
      })}
    </section>
  );
}

Replay.propTypes = {
  gameReplayData: PropTypes.array.isRequired,
};
