import React from "react";

import Countdown from "../components/Countdown";
import { SocketContext } from "../App";
import { testSocketData } from "./Homepage.stories";

export default {
  title: "Countdown",
  component: Countdown,
  decorators: [
    (Story) => (
      <SocketContext.Provider value={{ ...testSocketData }}>
        <Story />
      </SocketContext.Provider>
    ),
  ],
};

export const Default = () => <Countdown message="I'm a message!" />;
