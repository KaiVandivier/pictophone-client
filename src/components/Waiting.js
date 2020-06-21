import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import Replay from "./Replay";
import { SocketContext, RoomContext } from "../App";
import msgs from "../lib/messages";
import Button from "./Button";

import utilStyles from "../styles/utils.module.css";
import styles from "../styles/Waiting.module.css";

export default function Waiting({ gameReplayData }) {
  const socket = useContext(SocketContext);
  const room = useContext(RoomContext);
  const [gameOptions, setGameOptions] = useState({
    ...room.gameOptions,
  });

  // In case of "leave room":
  if (!room) return <div>Oops, there's no room!</div>;

  const allReady = room.players.every(({ ready }) => ready);
  const { ready: playerReady } = room.players.find(
    ({ id }) => id === socket.id
  ) || { ready: false };

  function handleChange({ target }) {
    setGameOptions({
      ...gameOptions,
      [target.name]: target.checked,
    });
  }

  return (
    <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
      {gameReplayData ? <Replay gameReplayData={gameReplayData} /> : null}

      <section
        className={`${utilStyles.center} ${
          gameReplayData ? styles.spaceAtBottom : null
        }`}
      >
        <header className={styles.header}>
          {!gameReplayData ? (
            <>
              <h1 className={utilStyles.titleHome}>Pict-o-phone!</h1>
              <h2>{room.name || "Game Room"}</h2>
            </>
          ) : (
            <h2>Ready for the next round?</h2>
          )}
          {/* To be readded when you can join a room by ID: */}
          {/* <details className={styles.details}>
            <summary>Room ID</summary>
            <p>{room.id}</p>
          </details> */}
        </header>

        <hr className={utilStyles.hr} />

        <div className={styles.gridContainer}>
          <div className={`${utilStyles.center} ${styles.playerList}`}>
            <h3>Players:</h3>

            <ul>
              {room.players.map(({ name, id, ready }) => (
                <li key={id}>
                  <p className={ready ? styles.ready : null}>
                    {name || id} {id === room.hostId ? "(host)" : null}
                    {" - "}
                    {ready ? (
                      <small>Ready!</small>
                    ) : (
                      <small
                        className={id === socket.id ? styles.highlight : null}
                      >
                        Not Ready
                      </small>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className={utilStyles.center}>
            {!allReady ? (
              <h3>Ready?</h3>
            ) : (
              <h3 className={styles.highlight}>Let's go!</h3>
            )}

            <Button
              onClick={() => socket.emit(msgs.TOGGLE_READY)}
              glow
              color="green"
              disabled={playerReady}
            >
              {!playerReady ? "I'm Ready!" : "\u2714"}
            </Button>

            {socket.id === room.hostId ? (
              <Button
                color="green"
                glow
                onClick={() => socket.emit(msgs.START_GAME, gameOptions)}
                disabled={!allReady}
              >
                Start Game!
              </Button>
            ) : null}
          </div>

          {socket.id === room.hostId ? (
            <details className={`${styles.details} ${styles.gameOptions}`}>
              <summary>Game Options</summary>

              <form>
                <label
                  className={styles.gameOption}
                  htmlFor="passWordOnOdd"
                  >
                  <input
                    type="checkbox"
                    id="passWordOnOdd"
                    name="passWordOnOdd"
                    defaultChecked={gameOptions.passWordOnOdd}
                    onChange={handleChange}
                  />
                  Pass first word with odd players
                </label>
                <label
                  className={styles.gameOption}
                  htmlFor="useHarderWords"
                  >
                  <input
                    type="checkbox"
                    id="useHarderWords"
                    name="useHarderWords"
                    defaultChecked={gameOptions.useHarderWords}
                    onChange={handleChange}
                  />
                  Use harder words
                </label>
              </form>
            </details>
          ) : null}
        </div>

        <hr className={utilStyles.hr} />

        <Button textButton onClick={() => socket.emit(msgs.LEAVE_ROOM)}>
          {"\u2190"} Leave Room
        </Button>
      </section>
    </div>
  );
}

Waiting.propTypes = {
  gameReplayData: PropTypes.array,
};
