import React from "react";
import { action } from "@storybook/addon-actions";

import Guessing from "../components/Guessing";
import { SocketContext } from "../App";
import { testDataURL } from "../lib/testUtils";
import { testSocketData } from "./Homepage.stories";


export default {
  title: "Guessing",
  component: Guessing,
  decorators: [
    (Story) => (
      <SocketContext.Provider value={{ ...testSocketData }}>
        <Story />
      </SocketContext.Provider>
    ),
  ],
};

export const Default = () => (
  <Guessing dataURL={testDataURL} onLoad={action("onLoad")} />
);
