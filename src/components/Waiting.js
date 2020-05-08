import React, { /* useEffect, */ useContext /* useState */ } from "react";
// import PropTypes from "prop-types";
import utilStyles from "../styles/utils.module.css";
import { SocketContext, RoomContext } from "../App";
import msgs from "../lib/messages";

// TODO: This and the "sendReady()" function in App could be combined better
//   Add TOGGLE ready and `startGame` for room creator
//   Add LeaveRoom
//   Allow input to change player name

export default function Waiting({ onClick }) {
  const socket = useContext(SocketContext);
  const room = useContext(RoomContext);

  const allReady = room.players.every(({ ready }) => ready);

  return (
    <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
      <h1 className={utilStyles.titleHome}>Pict-o-phone!</h1>

      <h2 className={utilStyles.heading}>Room id: <br/> {room.id}</h2>
      <small>(Send the room id to other players so they can join!)</small>
      <h2 className={utilStyles.heading}>Players: </h2>
      <ul className={utilStyles.playerList}>
        {/* TODO: Mark host; allow name change */}
        {room.players.map(({ name, id, ready }) => (
          <li key={id}>
            <p>
              {name || id} {id === socket.id ? "(you)" : null} {id === room.creatorId ? "(host)" : null}
            </p>
            <small>{ready ? "Ready!" : "Not Ready"}</small>
          </li>
        ))}
      </ul>
      <button
        onClick={() => socket.emit(msgs.TOGGLE_READY)}
        className={utilStyles.smallButton}
      >
        Ready!
      </button>
      {allReady ? (
        <p>Everyone is ready! Waiting for host to start.</p>
      ) : (
        <p>Waiting for everyone to be ready...</p>
      )}
      {socket.id === room.creatorId ? (
        <button
          className={utilStyles.button}
          onClick={() => socket.emit(msgs.START_GAME)}
          disabled={!allReady}
        >
          Start Game!
        </button>
      ) : (
        <p>Waiting for host to start...</p>
      )}
    </div>
  );
}

Waiting.propTypes = {};
