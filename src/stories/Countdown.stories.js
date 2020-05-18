import React from "react";

import Countdown from "../components/Countdown";

export default {
  title: "Countdown",
  component: Countdown,
}

export const Default = () => (
  <Countdown message="I'm a message!" />
);
