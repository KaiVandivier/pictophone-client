import React from "react";

import WordChoosing from "../components/WordChoosing";
import { SocketContext, RoomContext } from "../App";
import {
  testRoomPlayerNotReady,
  testRoomPlayerReady,
  testRoomAllReady,
  testWords,
} from "../lib/testUtils";
import { testSocketData } from "./Homepage.stories";


export default {
  title: "WordChoosing",
  component: WordChoosing,
  decorators: [
    (Story) => (
      <SocketContext.Provider value={{ ...testSocketData }}>
        <Story />
      </SocketContext.Provider>
    ),
  ],
  // excludeStories: /.*Data$/,
};

export const PlayerNotReady = () => (
  <RoomContext.Provider value={{ ...testRoomPlayerNotReady }}>
    <WordChoosing words={testWords} />
  </RoomContext.Provider>
);
export const PlayerReady = () => (
  <RoomContext.Provider value={{ ...testRoomPlayerReady }}>
    <WordChoosing words={testWords} />
  </RoomContext.Provider>
);

export const AllReady = () => (
  <RoomContext.Provider value={{ ...testRoomAllReady }}>
    <WordChoosing words={testWords} />
  </RoomContext.Provider>
);
