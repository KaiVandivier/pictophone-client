import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { endpoint, prodEndpoint } from "./config";
import GameRoom from "./components/GameRoom";
import utilStyles from "./styles/utils.module.css";

// testing Waiting
// import Waiting from "./components/Waiting";
// import { testRoom } from "./lib/testUtils";

// testing WordChoosing
// import WordChoosing from "./components/WordChoosing"
// import { testWords } from "./lib/testUtils";

// testing Drawing
// import Drawing from "./components/Drawing";

// testing Guessing
// import Guessing from "./components/Guessing";
// import { testDataURL } from "./lib/testUtils";

// testing Replay
// import Replay from "./components/Replay";
// import { testRoomData } from "./lib/testUtils";

// Testing Countdown
// import Countdown from "./components/Countdown";

const ENDPOINT =
  process.env.NODE_ENV === "production" ? prodEndpoint : endpoint;
const socket = socketIOClient(ENDPOINT);
export const SocketContext = React.createContext(socket);
export const RoomContext = React.createContext(null);

function App() {
  const [roomIds, setRoomIds] = useState([]);
  const [room, setRoom] = useState(null);
  const [roomInput, setRoomInput] = useState("");
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    socket.on("message", alert);
    socket.on("room-update", setRoom);

    return () => {
      socket.off("room-update");
      socket.off("message");
    };
  }, []);

  function createRoom() {
    socket.emit("create-room", playerName);
  }

  function joinRoom(roomId) {
    socket.emit("join-room", roomId, playerName);
  }

  function getRooms() {
    socket.once("all-rooms", setRoomIds);
    socket.emit("get-rooms");
  }

  return (
    <SocketContext.Provider value={socket}>
      {/* `room` value can be changed for testing (remember to change for production) */}
      <RoomContext.Provider value={room}> {/* testRoomData */}

        {/* <Waiting /> */}
        {/* <WordChoosing words={testWords} /> */}
        {/* <Drawing word={"magic carpet"} /> */}
        {/* <Guessing dataURL={testDataURL} /> */}
        {/* <Replay /> */}
        {/* <Countdown message={"Get ready to draw!"} /> */}

        {!room ? (
          <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
            <h1 className={utilStyles.titleHome}>Pict-o-phone!</h1>
            <fieldset className={`${utilStyles.center} ${utilStyles.fieldset}`}>
              <label htmlFor="player-name">
                <h2 className={utilStyles.heading}>1. Choose a Name:</h2>
              </label>
              <input
                type="text"
                id="player-name"
                style={{ textAlign: "center" }}
                placeholder="Enter Your Player Name"
                onChange={(e) => {
                  setPlayerName(e.target.value);
                }}
              />
            </fieldset>

            <fieldset className={`${utilStyles.center} ${utilStyles.fieldset}`}>
              <label htmlFor="join-room">
                <span className={utilStyles.heading}>
                  2. Join or Create Room:
                </span>
              </label>
              <input
                type="text"
                id="join-room"
                style={{ textAlign: "center" }}
                placeholder="Enter Room ID"
                onChange={(e) => {
                  setRoomInput(e.target.value);
                }}
              />
              <div>
                <button
                  onClick={() => joinRoom(roomInput)}
                  className={utilStyles.smallButton}
                  disabled={roomInput.length !== 22 || playerName.length < 1}
                >
                  Join Room
                </button>
                <button
                  onClick={createRoom}
                  className={utilStyles.smallButton}
                  disabled={playerName.length < 1}
                >
                  Create Room
                </button>
                <button
                  onClick={getRooms}
                  className={utilStyles.smallButton}
                  disabled={playerName.length < 1}
                >
                  Show Rooms
                </button>
              </div>
            </fieldset>

            {roomIds.map((roomId) => (
              <p key={roomId}>
                Room {roomId}
                {"   "}
                <button
                  onClick={() => joinRoom(roomId)}
                  className={utilStyles.smallButton}
                >
                  Join
                </button>
              </p>
            ))}
          </div>
        ) : (
          <GameRoom room={room} />
        )}
      </RoomContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
