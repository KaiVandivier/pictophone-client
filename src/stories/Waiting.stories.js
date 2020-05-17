import React from "react";

import Waiting from "../components/Waiting";
import { SocketContext, RoomContext } from "../App";
import { testSocket, testRoom } from "../lib/testUtils";


export default {
  title: "Waiting",
  component: Waiting,
  decorators: [Story => (
    <SocketContext.Provider value={{ ...testSocket }}>
      <RoomContext.Provider value={{ ...testRoom }}>
        <Story />
      </RoomContext.Provider>
    </SocketContext.Provider>
  )], // context goes here
  // excludeStories: /.*Data$/,
}

export const Default = () => (
  <Waiting />
);

export const WithReplay = () => (
  <Waiting gameReplayData />
)
