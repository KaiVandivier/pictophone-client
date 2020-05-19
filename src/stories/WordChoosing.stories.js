import React from "react";

import WordChoosing from "../components/WordChoosing";
import { SocketContext, RoomContext } from "../App";
import {
  testSocket,
  testRoomPlayerNotReady,
  testRoomPlayerReady,
  testRoomAllReady,
  testWords,
} from "../lib/testUtils";

export default {
  title: "WordChoosing",
  component: WordChoosing,
  decorators: [
    (Story) => (
      <SocketContext.Provider value={{ ...testSocket }}>
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
