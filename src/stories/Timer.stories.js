import React from "react";

import Timer from "../components/Timer";
import { SocketContext } from "../App";
import { testSocket } from "../lib/testUtils";

export default {
  title: "Timer",
  component: Timer,
  decorators: [
    (Story) => (
      <SocketContext.Provider value={{ ...testSocket }}>
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
