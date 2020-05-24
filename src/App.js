import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

import { endpoint, prodEndpoint } from "./config";
import GameRoom from "./components/GameRoom";
import Homepage from "./components/Homepage";
import msgs from "./lib/messages";

const ENDPOINT =
  process.env.NODE_ENV === "production" ? prodEndpoint : endpoint;
const socket = socketIOClient(ENDPOINT);

export const SocketContext = React.createContext(null);
export const RoomContext = React.createContext(null);

function App() {
  const [room, setRoom] = useState(null);
  
  useEffect(() => {
    socket.on(msgs.MESSAGE, (msg) => alert(msg));
    socket.on(msgs.ROOM_UPDATE, setRoom);

    return () => {
      socket.off(msgs.ROOM_UPDATE);
      socket.off(msgs.MESSAGE);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <RoomContext.Provider value={room}>
        {room ? (
          <GameRoom />
        ) : (
          <Homepage />
        )}
      </RoomContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
