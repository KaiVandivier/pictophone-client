import React, { useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { SocketContext } from "../App";
import Timer from "./Timer";
import utilStyles from "../styles/utils.module.css";
import styles from "../styles/Guessing.module.css";

export default function Guessing(props) {
  const socket = useContext(SocketContext);

  /**
   * I would have liked to use `state` to control the input, but it caused
   * problems setting up the listener in `useEffect()` to submit data in
   * response to "time-up": the data submitted from State would just be
   * what the state was initialized as.  Using `ref` makes the data submission
   * use the most up-to-date value of the input.
   *
   * Would it work if `useEffect` had a memoized function as a dependency
   * and thus updated when the function value changed? This would call
   * `useEffect` and add a listener every time the input changed, so we
   * would need to clean up the listener at the end of useEffect by
   * returning a cleanup function.  This seems clunky though.
   */
  const input = useRef(null);

  useEffect(() => {
    socket.emit("guessing-phase-loaded");
    socket.once("guessing-time-up", () =>
      socket.emit("guess-data", input.current.value)
    );
  }, [socket]);

  return (
    <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
      <h1 className={utilStyles.headingLg}>Guess:</h1>
      <div className={styles.gridContainer}>
        <div />
        <div className={utilStyles.center}>
          <label htmlFor="guess">
            <input
              style={{ textAlign: "center" }}
              ref={input}
              type="text"
              name="guess"
              id="guess"
              placeholder="What's in the image?"
            />
          </label>
        </div>
        <div>
          <Timer />
        </div>
      </div>
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
