import React from "react";

import Drawing from "../components/Drawing";
import { SocketContext } from "../App";
import { testSocket } from "../lib/testUtils";

export default {
  title: "Drawing",
  component: Drawing,
  decorators: [
    (Story) => (
      <SocketContext.Provider value={{ ...testSocket }}>
        <Story />
      </SocketContext.Provider>
    ),
  ],
}

export const Default = () => (
  <Drawing word="magic carpet" />
)