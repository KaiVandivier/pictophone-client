import React from 'react';
import Timer from "./Timer";
import utilStyles from "../styles/utils.module.css";

const Countdown = ({ message }) => {
  return (
    <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
      <h1 className={utilStyles.titleHome}>Pict-o-phone!</h1>
      <h2 className={utilStyles.headingLg}>{message}</h2>
      <Timer />
    </div>
  );
};

export default Countdown;