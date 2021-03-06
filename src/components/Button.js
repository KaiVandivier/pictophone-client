import React from "react";
import cx from "classnames";
import styles from "../styles/Button.module.css";

export default function Button({
  children,
  color,
  disabled,
  glow,
  lookAtMe,
  noShadow,
  onClick,
  small,
  textButton,
  type,
}) {
  const classNames = cx({
    [styles.button]: !textButton,
    [styles.textButton]: textButton,
    [styles.purple]: !color && !textButton,
    [styles.green]: color === "green",
    [styles.orange]: color === "orange",
    [styles.lookAtMe]: lookAtMe,
    [styles.glow]: glow,
    [styles.small]: small,
    [styles.noShadow]: noShadow,
  });

  return (
    <button
      type={type}
      disabled={disabled}
      className={classNames}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
