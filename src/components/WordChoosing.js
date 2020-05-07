import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import utilStyles from "../styles/utils.module.css";
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
    setSubmitted(true)
  }

  function handleChange(e) {
    setChecked(e.target.value);
  }

  const allReady = room.players.every(({ ready }) => ready);

  return (
    <div className={utilStyles.center}>
      <h1>Choose a Word:</h1>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={submitted}>
          {words.map((word) => (
            <div key={word}>
              <label htmlFor={word}>
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
            </div>
          ))}
          <div>
            <label htmlFor="custom">
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
          </div>

          <button type="submit" disabled={!checked}>
            Submit
          </button>
        </fieldset>
        {allReady ? (
          <div>
            <p>Everyone is ready!</p>
            {socket.id === room.creatorId ? (
              <button
                className={utilStyles.button}
                onClick={() => socket.emit(msgs.CONTINUE)}
              >
                Start Drawing!
              </button>
            ) : (
              <p>Waiting for host to start...</p>
            )}
          </div>
        ) : (
          <p>Waiting for everyone to choose a word...</p>
        )}
      </form>
    </div>
  );
}

WordChoosing.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
};
