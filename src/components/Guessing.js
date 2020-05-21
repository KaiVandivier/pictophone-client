import React, { useEffect, useContext, useRef, useState } from "react";
import PropTypes from "prop-types";

import { SocketContext } from "../App";
import Timer from "./Timer";
import Button from "./Button";

import utilStyles from "../styles/utils.module.css";
import styles from "../styles/Guessing.module.css";

export default function Guessing({ dataURL, onLoad }) {
  const [submitted, setSubmitted] = useState(false);
  const socket = useContext(SocketContext);

  // use a ref to track value for submit
  // TODO: Try using state, and use `set` with a function to keep it updated
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();

    onLoad(true); // acknowledge server's message
    socket.once("get-data", (ack) => ack(inputRef.current.value));
  }, [socket, onLoad]);

  return (
    <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
      <h1 className={utilStyles.headingLg}>What do you see?</h1>
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
                ref={inputRef}
                disabled={submitted}
                type="text"
                name="guess"
                id="guess"
                placeholder="Guess"
              />
            </label>
          </fieldset>
        </div>
        <Button
          type="submit"
          disabled={submitted}
          color="green"
        >
          {"\u2714"}
        </Button>
      </form>
      <img
        src={dataURL}
        alt="Previous player's drawing"
        className={utilStyles.drawing}
      />
    </div>
  );
}

Guessing.propTypes = {
  dataURL: PropTypes.string.isRequired,
  onLoad: PropTypes.func.isRequired,
};
