import React from "react";

import Countdown from "../components/Countdown";
import { SocketContext } from "../App";
import { testSocket } from "../lib/testUtils";

export default {
  title: "Countdown",
  component: Countdown,
  decorators: [
    (Story) => (
      <SocketContext.Provider value={{ ...testSocket }}>
        <Story />
      </SocketContext.Provider>
    ),
  ],
};

export const Default = () => <Countdown message="I'm a message!" />;
