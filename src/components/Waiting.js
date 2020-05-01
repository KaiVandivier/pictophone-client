import React from 'react';

// TODO: This and the "sendReady() function in App could be combined better

const Waiting = (props) => {
  return (
    <div>
      <button onClick={props.onClick}>Ready</button>
    </div>
  );
};

export default Waiting;