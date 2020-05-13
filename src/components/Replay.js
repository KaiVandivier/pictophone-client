import React from "react";
import PropTypes from "prop-types";
import utilStyles from "../styles/utils.module.css";

export default function Replay({ gameReplayData }) {
  return (
    <section className={`${utilStyles.center}`}>
      <h1 className={utilStyles.headingLg}>
        Round over! Let's see what happened!
      </h1>
      {/* Loop over players: */}
      {gameReplayData.map((player) => {
        const { word, rounds } = player.replayData;
        return (
          <div className={utilStyles.center} key={player.id}>
            <hr className={utilStyles.hr} />
            <h1 className={utilStyles.heading}>
              <em>{player.name || player.id}'s word was: </em>
              <strong>"{word}"</strong>
            </h1>
            {rounds.map(({ type, data, playerName }) => {
              if (type === "guess") {
                return (
                  <h2 className={utilStyles.heading} key={playerName}>
                    {playerName} guessed: <strong>"{data}"</strong>
                  </h2>
                );
              }
              if (type === "drawing") {
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
            <hr />
          </div>
        );
      })}
    </section>
  );
}

Replay.propTypes = {
  gameReplayData: PropTypes.array.isRequired,
};
