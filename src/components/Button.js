import React from "react";
import cx from "classnames";
import styles from "../styles/Button.module.css";

export function Button({
  children,
  lookAtMe,
  onClick,
  textButton,
  color
}) {
  const classNames = cx({
    [styles.button]: !textButton,
    [styles.textButton]: textButton,
    [styles.default]: !color,
    [styles.lookAtMe]: lookAtMe,

  })

  return (
    <button 
      className={classNames}
      onClick={onClick}
    >
      {children}
    </button>
  )
}