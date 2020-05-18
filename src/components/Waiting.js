import React, { useContext } from "react";
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

  // In case of "leave room":
  if (!room) return <div>Oops, there's no room!</div>;

  const allReady = room.players.every(({ ready }) => ready);
  const { ready: playerReady } = room.players.find(
    ({ id }) => id === socket.id
  ) || { ready: false };

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
              <p>
                Room id: <code>{room.id}</code>
              </p>
              <p>(Send the room id to other players so they can join!)</p>
            </>
          ) : (
            <>
              <h2>...play again?</h2>
              <p>
                {room.name || "Game Room"}, id: <code>{room.id}</code>
              </p>
            </>
          )}
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
                      <small className={id === socket.id ? styles.highlight : null}>Not Ready Yet</small>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className={utilStyles.center}>
            {!playerReady ? (
              <p className={styles.highlight}>Ready to start?</p>
            ) : allReady ? (
              <p>Everyone is ready! Waiting for host to start.</p>
            ) : (
              <p>Waiting for everyone to be ready...</p>
            )}

            <Button
              onClick={() => socket.emit(msgs.TOGGLE_READY)}
              glow={!playerReady}
              color={playerReady ? "green" : null}
            >
              {!playerReady ? "I'm Ready!" : "\u2714"}
            </Button>

            {socket.id === room.hostId ? (
              <Button
                color="green"
                onClick={() => socket.emit(msgs.START_GAME)}
                disabled={!allReady}
              >
                Start Game!
              </Button>
            ) : null}
          </div>
        </div>

        <hr className={utilStyles.hr} />

        <Button
          textButton
          onClick={() => socket.emit(msgs.LEAVE_ROOM)}
        >
          {"\u2190"} Leave Room
        </Button>
      </section>
    </div>
  );
}

Waiting.propTypes = {
  gameReplayData: PropTypes.array,
};
