import React from "react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs";

import Homepage from "../components/Homepage";
import { SocketContext } from "../App";

export const testSocketData = {
  id: "abc1234",
  on: action("on"),
  emit: action("emit"),
  off: action("off"),
  once: action("once"),
};

export default {
  title: "Homepage",
  component: Homepage,
  decorators: [withKnobs,
    (Story) => (
      <SocketContext.Provider value={{ ...testSocketData }}>
        <Story />
      </SocketContext.Provider>
    ),
  ],
  excludeStories: /.*Data$/
}

export const Default = () => (
  <Homepage />
)