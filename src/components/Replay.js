import React, { useContext } from "react";
// import PropTypes from "prop-types";
import utilStyles from "../styles/utils.module.css";
import { RoomContext } from "../App";

export default function Replay() {
  const room = useContext(RoomContext);

  return (
    <div className={utilStyles.center}>
      {/* Loop over players: */}
      {room.players.map((player) => {
        const { word, rounds } = player.replayData;
        return (
          <div className={utilStyles.center} key={player.id}>
            <h1 style={{ textAlign: "center" }}>
              {player.name || player.id}'s word was: "{word}"
            </h1>
            {rounds.map(({ type, data, playerName }) => {
              if (type === "guess") {
                return (
                  <h2 key={playerName}>
                    {playerName} guessed: {data}
                  </h2>
                );
              }
              if (type === "drawing") {
                return (
                  <div className={utilStyles.center} key={playerName}>
                    <h2>{playerName} drew:</h2>
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
    </div>
  );
}

Replay.propTypes = {};
