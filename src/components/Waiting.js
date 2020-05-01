import React from 'react';
import utilStyles from "../styles/utils.module.css";

// TODO: This and the "sendReady() function in App could be combined better

const Waiting = (props) => {
  return (
    <div className={utilStyles.center}>
      <button onClick={props.onClick}>Ready</button>
    </div>
  );
};

export default Waiting;