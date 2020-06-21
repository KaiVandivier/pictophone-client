import React from "react";

import Waiting from "../components/Waiting";
import { SocketContext, RoomContext } from "../App";
import {
  testRoomPlayerNotReady,
  testRoomPlayerReady,
  testRoomNotHost,
  testRoomAllReady,
  testRoomOptionsChecked,
  testReplayData,
} from "../lib/testUtils";
import { testSocketData } from "./Homepage.stories";


export default {
  title: "Waiting",
  component: Waiting,
  decorators: [
    (Story) => (
      <SocketContext.Provider value={{ ...testSocketData }}>
        <Story />
      </SocketContext.Provider>
    ),
  ],
  // excludeStories: /.*Data$/,
};

export const HostNotReady = () => (
  <RoomContext.Provider value={{ ...testRoomPlayerNotReady }}>
    <Waiting />
  </RoomContext.Provider>
);

export const HostReady = () => (
  <RoomContext.Provider value={{ ...testRoomPlayerReady }}>
    <Waiting />
  </RoomContext.Provider>
);

export const NotHost = () => (
  <RoomContext.Provider value={{ ...testRoomNotHost }}>
    <Waiting />
  </RoomContext.Provider>
)

export const AllReady = () => (
  <RoomContext.Provider value={{ ...testRoomAllReady }}>
    <Waiting />
  </RoomContext.Provider>
);

export const OptionsChecked = () => (
  <RoomContext.Provider value={{ ...testRoomOptionsChecked }}>
    <Waiting />
  </RoomContext.Provider>
);

export const WithReplay = () => (
  <RoomContext.Provider value={{ ...testRoomPlayerNotReady }}>
    <Waiting gameReplayData={testReplayData} />
  </RoomContext.Provider>
);
