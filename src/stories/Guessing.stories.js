import React from "react";

import Guessing from "../components/Guessing";
import { SocketContext } from "../App";
import { testSocket, testDataURL } from "../lib/testUtils";

export default {
  title: "Guessing",
  component: Guessing,
  decorators: [
    (Story) => (
      <SocketContext.Provider value={{ ...testSocket }}>
        <Story />
      </SocketContext.Provider>
    ),
  ],
}

export const Default = () => (
  <Guessing dataURL={testDataURL} />
);
