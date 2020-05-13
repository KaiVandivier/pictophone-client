import React, { /* useEffect, */ useContext /* useState */ } from "react";
// import PropTypes from "prop-types";
import utilStyles from "../styles/utils.module.css";
import styles from "../styles/Waiting.module.css";
import { SocketContext, RoomContext } from "../App";
import msgs from "../lib/messages";

export default function Waiting(props) {
  const socket = useContext(SocketContext);
  const room = useContext(RoomContext);

  // In case of "leave room":
  if (!room) return null;

  const allReady = room.players.every(({ ready }) => ready);
  const { ready: playerReady } = room.players.find(
    ({ id }) => id === socket.id
  );

  return (
    <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
      <header className={styles.header}>
        <h1 className={utilStyles.titleHome}>Pict-o-phone!</h1>

        <h2>{room.name || "Game Room"}</h2>

        <p>
          Room id: <code>{room.id}</code>
        </p>
        <p>(Send the room id to other players so they can join!)</p>
      </header>

      <hr className={utilStyles.hr} />

      <div className={styles.gridContainer}>
        <div className={utilStyles.center}>
          <button
            onClick={() => socket.emit(msgs.TOGGLE_READY)}
            className={`${utilStyles.smallButton} ${
              playerReady ? utilStyles.greenButton : null
            }`}
          >
            {!playerReady ? "I'm Ready!" : "\u2714"}
          </button>

          {allReady ? (
            <p>Everyone is ready! Waiting for host to start.</p>
          ) : (
            <p>Waiting for everyone to be ready...</p>
          )}

          {socket.id === room.hostId ? (
            <button
              className={`${utilStyles.smallButton} ${utilStyles.greenButton}`}
              onClick={() => socket.emit(msgs.START_GAME)}
              disabled={!allReady}
            >
              Start Game!
            </button>
          ) : null}
        </div>

        <div className={`${utilStyles.center} ${styles.playerList}`}>
          <h3>Players:</h3>

          <ul>
            {room.players.map(({ name, id, ready }) => (
              <li key={id}>
                <p className={ready ? styles.ready : null}>
                  {name || id} {id === room.hostId ? "(host)" : null}
                  {" - "}
                  <small>{ready ? "Ready!" : "Not Ready"}</small>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr className={utilStyles.hr} />

      <button
        className={utilStyles.textButton}
        onClick={() => socket.emit(msgs.LEAVE_ROOM)}
      >
        {"\u2190"} Leave Room
      </button>
    </div>
  );
}

Waiting.propTypes = {};
