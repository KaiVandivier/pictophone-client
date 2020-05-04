import React, { /* useEffect, */ useContext, /* useState */ } from "react";
import PropTypes from "prop-types";
import utilStyles from "../styles/utils.module.css";
import { SocketContext, RoomContext } from "../App";

// TODO: This and the "sendReady()" function in App could be combined better
//   Add TOGGLE ready and `startGame` for room creator
//   Add LeaveRoom
//   Allow input to change player name

export default function Waiting({ onClick }) {
  const socket = useContext(SocketContext);
  const room = useContext(RoomContext);

  return (
    <div className={utilStyles.center}>
      <p>Room id: {room.id}</p>
      <small>Send the room id to other players so they can join</small>
      <p>Players: </p>
      <ul>
        {room.players.map(({ name, id, ready }) => (
          <li key={id}>
            <p>
              {name || id} {id === socket.id ? "(you)" : null}
            </p>
            <p>{ready ? "Ready!" : "Not Ready"}</p>
          </li>
        ))}
      </ul>
      <button onClick={onClick} className={utilStyles.button}>
        Ready!
      </button>
    </div>
  );
}

Waiting.propTypes = {
  onClick: PropTypes.func.isRequired,
};
