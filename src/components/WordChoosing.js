import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import utilStyles from "../styles/utils.module.css";
import styles from "../styles/WordChoosing.module.css";
import { SocketContext, RoomContext } from "../App";
import msgs from "../lib/messages";

export default function WordChoosing({ words }) {
  const [checked, setChecked] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const socket = useContext(SocketContext);
  const room = useContext(RoomContext);

  function handleSubmit(e) {
    e.preventDefault();
    if (!checked) return alert("Please choose a word!");
    const submitVal = checked === "custom" ? customInput : checked;
    // submit value to server
    socket.emit("word-chosen", submitVal);
    setSubmitted(true);
  }

  function handleChange(e) {
    setChecked(e.target.value);
  }

  const allReady = room?.players.every(({ ready }) => ready);

  return (
    <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
      <h1 className={utilStyles.headingLg}>Choose a Word:</h1>
      <form onSubmit={handleSubmit}>
        <fieldset
          className={`${utilStyles.fieldset} ${utilStyles.center}`}
          disabled={submitted}
        >
          {words.map((word) => (
            <label
              key={word}
              className={`${styles.wordChoice} ${
                checked === word ? styles.checked : null
              }`}
              htmlFor={word}
            >
              <input
                id={word}
                type="radio"
                name="word"
                value={word}
                onChange={handleChange}
                checked={checked === word}
              />
              {word}
            </label>
          ))}
          <label
            className={`${styles.wordChoice} ${
              checked === "custom" ? styles.checked : null
            }`}
            htmlFor="custom"
          >
            <input
              id="custom"
              type="radio"
              name="word"
              value="custom"
              onChange={handleChange}
              checked={checked === "custom"}
            />
            <input
              type="text"
              name="custom"
              placeholder="or write your own here!"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onClick={() => setChecked("custom")}
            />
          </label>

          <button
            type="submit"
            disabled={!checked}
            className={utilStyles.smallButton}
          >
            Submit Choice
          </button>
        </fieldset>
      </form>
      {allReady ? (
        <p>Everyone is ready! Waiting for host to start.</p>
      ) : (
        <p>Waiting for everyone to choose a word...</p>
      )}
      {true || socket.id === room.creatorId ? (
        <button
          className={utilStyles.button}
          onClick={() => socket.emit(msgs.CONTINUE)}
          disabled={!allReady}
        >
          Start Drawing!
        </button>
      ) : (
        <p>Waiting for host to start...</p>
      )}
    </div>
  );
}

WordChoosing.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
};
