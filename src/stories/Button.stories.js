import React from "react";
import { action } from "@storybook/addon-actions";

import Button from "../components/Button";

export default {
  title: "Button",
  component: Button,
  // maybe add a style wrapper, like "center"
};

export const Default = () => (
  <Button onClick={action("clicked")}>Hello Button</Button>
);

export const Emoji = () => (
  <Button onClick={action("clicked")}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);

export const LookAtMe = () => (
  <Button onClick={action("clicked")} lookAtMe>
    Look at me!
  </Button>
);

export const Glow = () => (
  <Button onClick={action("clicked")} glow>
    I Glow
  </Button>
);

export const TextButton = () => (
  <Button textButton onClick={action("clicked")}>
    Text Button
  </Button>
);

export const Colors = () => (
  <>
    <Button onClick={action("clicked")}>
      I'm purple
    </Button>
    <Button color="green" onClick={action("clicked")}>
      I'm green
    </Button>
  </>
);
