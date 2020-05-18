import React from "react";

import Waiting from "../components/Waiting";
import { SocketContext, RoomContext } from "../App";
import {
  testSocket,
  testRoomPlayerNotReady,
  testRoomPlayerReady,
  testReplayData,
} from "../lib/testUtils";

export default {
  title: "Waiting",
  component: Waiting,
  decorators: [
    (Story) => (
      <SocketContext.Provider value={{ ...testSocket }}>
        <Story />
      </SocketContext.Provider>
    ),
  ], // context goes here
  // excludeStories: /.*Data$/,
};

export const PlayerNotReady = () => (
  <RoomContext.Provider value={{ ...testRoomPlayerNotReady }}>
    <Waiting />
  </RoomContext.Provider>
);
export const PlayerReady = () => (
  <RoomContext.Provider value={{ ...testRoomPlayerReady }}>
    <Waiting />
  </RoomContext.Provider>
);

export const WithReplay = () => (
  <RoomContext.Provider value={{ ...testRoomPlayerNotReady }}>
    <Waiting gameReplayData={testReplayData} />
  </RoomContext.Provider>
);
