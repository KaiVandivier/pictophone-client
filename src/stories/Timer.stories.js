import React from "react";

import Timer from "../components/Timer";
import { SocketContext } from "../App";
import { testSocketData } from "./Homepage.stories";


export default {
  title: "Timer",
  component: Timer,
  decorators: [
    (Story) => (
      <SocketContext.Provider value={{ ...testSocketData }}>
        <Story />
      </SocketContext.Provider>
    ),
  ],
}

export const Default = () => (
  <Timer />
);

export const HighlightTimeLow = () => (
  <Timer highlightTimeLow />
)
