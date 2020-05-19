import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

import { endpoint, prodEndpoint } from "./config";
import GameRoom from "./components/GameRoom";
import msgs from "./lib/messages";

import utilStyles from "./styles/utils.module.css";
import styles from "./styles/Homepage.module.css";

const ENDPOINT =
  process.env.NODE_ENV === "production" ? prodEndpoint : endpoint;
const socket = socketIOClient(ENDPOINT);
export const SocketContext = React.createContext(null);
export const RoomContext = React.createContext(null);

function App() {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [roomInput, setRoomInput] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerNameSubmitted, setPlayNameSubmitted] = useState(false);

  useEffect(() => {
    socket.on(msgs.MESSAGE, (msg) => alert(msg));
    socket.on(msgs.ROOM_UPDATE, setRoom);

    getRooms();

    return () => {
      socket.off(msgs.ROOM_UPDATE);
      socket.off(msgs.MESSAGE);
    };
  }, []);

  function createRoom() {
    socket.emit(msgs.CREATE_ROOM, playerName);
  }

  function joinRoom(roomId) {
    socket.emit(msgs.JOIN_ROOM, roomId, playerName);
    getRooms();
  }

  function getRooms() {
    socket.emit(msgs.GET_ROOMS, setRooms);
  }

  return (
    <SocketContext.Provider value={socket}>
      <RoomContext.Provider value={room}>
        {room ? (
          <GameRoom />
        ) : (
          <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
            <h1 className={utilStyles.titleHome}>Pict-o-phone!</h1>

            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                getRooms();
                setPlayNameSubmitted(true);
              }}
            >
              <fieldset
                disabled={playerNameSubmitted}
                className={utilStyles.fieldset}
              >
                <div className={utilStyles.center}>
                  <label htmlFor="player-name">
                    <h2 className={utilStyles.heading}>1. Choose a Name:</h2>
                  </label>
                  <input
                    type="text"
                    id="player-name"
                    style={{ textAlign: "center" }}
                    placeholder="Enter Your Player Name"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value);
                    }}
                  />
                  <button
                    disabled={playerName.length < 1}
                    className={utilStyles.smallButton}
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </fieldset>
            </form>

            <fieldset
              disabled={!playerNameSubmitted}
              className={utilStyles.fieldset}
            >
              <div className={utilStyles.center}>
                <h2 className={utilStyles.heading}>2. Create or Join Room:</h2>

                <button
                  onClick={createRoom}
                  className={utilStyles.smallButton}
                  disabled={!playerNameSubmitted}
                >
                  Create Room
                </button>

                <button onClick={getRooms} className={utilStyles.textButton}>
                  Refresh Rooms
                </button>

                <ul className={styles.roomList}>
                  <li className={styles.roomItem}>
                    <div>
                      <input
                        type="text"
                        id="join-room"
                        placeholder="Enter Room ID"
                        onChange={(e) => {
                          setRoomInput(e.target.value);
                        }}
                      />
                    </div>
                    <button
                      onClick={() => joinRoom(roomInput)}
                      className={utilStyles.smallButton}
                      disabled={
                        roomInput.length !== 22 || playerName.length < 1
                      }
                    >
                      Join
                    </button>
                  </li>

                  {rooms.map(({ id, name }) => (
                    <li key={id} className={styles.roomItem}>
                      <p>{name}</p>

                      <button
                        onClick={() => joinRoom(id)}
                        className={utilStyles.smallButton}
                        disabled={!playerNameSubmitted}
                      >
                        Join
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </fieldset>
          </div>
        )}
      </RoomContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
