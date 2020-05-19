import React, { useEffect, useContext, useRef, useState } from "react";
import PropTypes from "prop-types";

import { SocketContext } from "../App";
import Timer from "./Timer";
import Button from "./Button";

import utilStyles from "../styles/utils.module.css";
import styles from "../styles/Guessing.module.css";

export default function Guessing(props) {
  const [submitted, setSubmitted] = useState(false);
  const socket = useContext(SocketContext);

  // use a ref to track value for submit
  const input = useRef(null);

  useEffect(() => {
    props.onLoad(true); // acknowledge server's message
    socket.once("get-data", (ack) => ack(input.current.value));
  }, [socket]);

  return (
    <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
      <h1 className={utilStyles.headingLg}>Guess:</h1>
      <form
        autoComplete="off"
        className={styles.gridContainer}
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className={styles.timer}>
          <Timer highlightTimeLow />
        </div>
        <div className={utilStyles.center}>
          <fieldset disabled={submitted} className={utilStyles.fieldset}>
            <label htmlFor="guess">
              <input
                className={styles.glow}
                disabled={submitted}
                ref={input}
                type="text"
                name="guess"
                id="guess"
                placeholder="What's in the image?"
              />
            </label>
          </fieldset>
        </div>
        <Button
          type="submit"
          disabled={submitted}
          color={
            submitted ? "green" : null
          }
        >
          {"\u2714"}
        </Button>
      </form>
      <img
        src={props.dataURL}
        alt="Previous player's drawing"
        className={utilStyles.drawing}
      />
    </div>
  );
}

Guessing.propTypes = {
  dataURL: PropTypes.string.isRequired,
};
