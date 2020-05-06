import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { endpoint, prodEndpoint } from "./config";
import GameRoom from "./components/GameRoom";
import utilStyles from "./styles/utils.module.css";

const ENDPOINT =
  process.env.NODE_ENV === "production" ? prodEndpoint : endpoint;
const socket = socketIOClient(ENDPOINT);
export const SocketContext = React.createContext(socket);
export const RoomContext = React.createContext(null);

function App() {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [roomInput, setRoomInput] = useState("");

  useEffect(() => {
    socket.on("message", console.log);
    socket.on("room-update", setRoom);

    return () => {
      socket.off("room-update");
      socket.off("message");
    };
  }, []);

  function createRoom() {
    socket.emit("create-room");
  }

  function joinRoom(room) {
    socket.emit("join-room", { roomId: room });
  }

  /**
   * TODO:
   * 1. Rename `rooms` to `roomIds`
   * 2. Change `data` pattern to just pass roomIds in backend
   * 3. Change the callback to just `setRoomIds`
   * 4. Change other uses of `rooms` in this file
   */
  function getRooms() {
    socket.once("all-rooms", ({ roomIds }) => {
      console.log(roomIds);
      setRooms(roomIds);
    });
    socket.emit("get-rooms");
  }

  return (
    <SocketContext.Provider value={socket}>
      <RoomContext.Provider value={room}>
        {!room ? (
          <div className={utilStyles.center}>
            <label htmlFor="join-room">Join Room: </label>
            <input
              type="text"
              id="join-room"
              style={{ textAlign: "center" }}
              placeholder="Room ID"
              onChange={(e) => {
                setRoomInput(e.target.value);
              }}
            />
            <button onClick={() => joinRoom(roomInput)}>Join</button>
            <button onClick={createRoom}>Create Room</button>
            <button onClick={getRooms}>Get Rooms</button>
            {rooms.map((roomId) => (
              <p key={roomId}>
                Room {roomId}
                {"   "}
                <button onClick={() => joinRoom(roomId)}>Join</button>
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
