import React, { /* useEffect, */ useContext, /* useState */ } from "react";
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
    <div className={utilStyles.center}>
      <p>Room id: {room.id}</p>
      <small>(Send the room id to other players so they can join!)</small>
      <p>Players: </p>
      <ul>
        {/* TODO: Mark host; allow name change */}
        {room.players.map(({ name, id, ready }) => (
          <li key={id}>
            <p>
              {name || id} {id === socket.id ? "(you)" : null}
            </p>
            <p>{ready ? "Ready!" : "Not Ready"}</p>
          </li>
        ))}
      </ul>
      <button onClick={() => socket.emit(msgs.TOGGLE_READY)} className={utilStyles.button}>
        Ready!
      </button>
      {/* TODO: If not room owner, show "Everyone is ready! Waiting for host to start..." */}
      {allReady && room.creatorId === socket.id ? (
        <button onClick={() => socket.emit(msgs.START_GAME)} className={utilStyles.button}>Start Game!</button>
      ) : (
        <p>Waiting for everyone to be ready...</p>
      )}
    </div>
  );
}

Waiting.propTypes = {};
