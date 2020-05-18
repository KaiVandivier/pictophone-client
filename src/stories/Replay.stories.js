import React from "react";

import Replay from "../components/Replay";
import { testReplayData } from "../lib/testUtils";

export default {
  title: "Replay",
  component: Replay,
}

export const Default = () => (
  <Replay gameReplayData={testReplayData} />
)
