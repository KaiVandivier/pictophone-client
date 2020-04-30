import React, { useState } from "react";
import utilStyles from "../styles/utils.module.css";

export default function Guess(props) {
  const [guess, setGuess] = useState("");
  
  // TODO: Send this information somewhere

  return (
    <div className={utilStyles.center}>
      <div>
        <label htmlFor="guess">
          Guess:
          <input
            type="text"
            name="guess"
            id="guess"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
        </label>
      </div>
      <img
        src={props.dataURL}
        alt="Previous player's drawing"
        className={utilStyles.drawing}
      />
    </div>
  );
}
