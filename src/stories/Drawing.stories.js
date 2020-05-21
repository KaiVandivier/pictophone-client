import React from "react";
import { action } from "@storybook/addon-actions";
import { withKnobs, text } from "@storybook/addon-knobs";

import Drawing from "../components/Drawing";
import { SocketContext } from "../App";
import { testSocket } from "../lib/testUtils";

export default {
  title: "Drawing",
  component: Drawing,
  decorators: [withKnobs,
    (Story) => (
      <SocketContext.Provider value={{ ...testSocket }}>
        <Story />
      </SocketContext.Provider>
    ),
  ],
}

export const Default = () => (
  <Drawing word={text("Word", "magic carpet")} onLoad={action("onLoad")} />
)