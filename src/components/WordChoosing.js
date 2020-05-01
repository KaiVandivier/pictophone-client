import React, { useState, /* useContext */ } from "react";
import PropTypes from "prop-types";
// import { SocketContext } from "../App";

export default function WordChoosing({ words, submitFn }) {
  const [checked, setChecked] = useState(null);
  const [customInput, setCustomInput] = useState("");
  // const socket = useContext(SocketContext);

  function handleSubmit(e) {
    e.preventDefault();
    if (!checked) return alert("Please choose a word!");
    const submitVal = checked === "custom" ? customInput : checked;
    // submit value to server
    submitFn(submitVal);
  }

  function handleChange(e) {
    setChecked(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit" disabled={!checked}>Submit</button>
    </form>
  );
}

WordChoosing.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitFn: PropTypes.func.isRequired
}
