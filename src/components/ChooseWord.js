import React, { useState } from "react";

export default function ChooseWord(props) {
  const [checked, setChecked] = useState(null);
  const [customInput, setCustomInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const submitVal = checked === "custom" ? customInput : checked;
    // TODO: submit value to server
    // props.submitFn(submitVal);  ?
    console.log("submitting", submitVal);
  }

  function handleChange(e) {
    console.log(e.target);
    setChecked(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      {props.words.map((word) => (
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

      <button type="submit">Submit</button>
    </form>
  );
}
