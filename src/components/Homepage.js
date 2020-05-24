import React, { useState, useContext, useEffect } from "react";

import Button from "./Button";
import { SocketContext } from "../App";
import msgs from "../lib/messages";

import styles from "../styles/Homepage.module.css";
import utilStyles from "../styles/utils.module.css";

// TODO: Enable joining a room by ID

export default function Homepage() {
  const [rooms, setRooms] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [playerNameSubmitted, setPlayerNameSubmitted] = useState(false);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on(msgs.OPEN_ROOMS, setRooms);
    getRooms();

    return () => socket.off(msgs.OPEN_ROOMS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function createRoom() {
    socket.emit(msgs.CREATE_ROOM, playerName);
  }

  function joinRoom(roomId) {
    socket.emit(msgs.JOIN_ROOM, roomId, playerName);
    getRooms();
  }

  function getRooms() {
    socket.emit(msgs.GET_ROOMS, setRooms);
  }

  return (
    <div className={`${utilStyles.center} ${utilStyles.fullPage}`}>
      <h1 className={utilStyles.titleHome}>Pict-o-phone!</h1>

      <details className={styles.details}>
        <summary>How to Play</summary>
        <div>
          <p>
            The game is like a cross between Telephone and Pictionary: you will
            try to communicate a word or phrase all the way around the room
            through a chain of alternating drawings and guesses. Try to get your
            word to make it all the way around the room!
          </p>
          <p>The game will happen like this:</p>
          <ol>
            <li>
              <p>
                When the room host starts the game, everyone will choose a word
                from a small list presented to them.
              </p>
            </li>
            <li>
              <p>
                Then, when the game starts, everyone will have 60 seconds to
                draw a picture that represents their word or phrase.
              </p>
            </li>
            <li>
              <p>
                When the drawing time is up, everyone's drawing will be passed
                to the next player, and everyone will have 20 seconds to look at
                the drawing that was passed to them and try to guess the word or
                phrase the previous player was trying to represent.
              </p>
            </li>
            <li>
              <p>
                When the guessing time is up, everyone's guesses will be passed
                to the next player, and everyone will have 60 seconds to draw a
                picture that represents the word or phrase that has just been
                passed to them from the previous player's guess.
              </p>
            </li>
            <li>
              <p>
                The drawing and guessing will repeat until the drawings have
                made it all the way around the room, at which point the the game
                will end, and a replay will show the journey of all of the words
                and drawings!
              </p>
            </li>
          </ol>
        </div>
        <Button
          textButton
          onClick={(e) => (e.target.parentElement.open = false)}
        >
          Close Instructions
        </Button>
      </details>

      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          getRooms();
          setPlayerNameSubmitted(true);
        }}
      >
        <fieldset
          disabled={playerNameSubmitted}
          className={utilStyles.fieldset}
        >
          <div className={utilStyles.center}>
            <label htmlFor="player-name">
              <h2 className={utilStyles.heading}>1. Choose a Name:</h2>
            </label>

            <input
              type="text"
              id="player-name"
              style={{ textAlign: "center" }}
              placeholder="Player Name"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
              }}
            />

            <Button
              disabled={playerName.length < 1 || playerNameSubmitted}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </fieldset>
      </form>

      <fieldset disabled={!playerNameSubmitted} className={utilStyles.fieldset}>
        <div className={utilStyles.center}>
          <h2 className={utilStyles.heading}>2. Join or Create Room:</h2>

          <ul className={styles.roomList}>
            {rooms.length === 0 ? (
              <li className={styles.roomItem}>
                <p>No open rooms yet!</p>
                <Button disabled>Join</Button>
              </li>
            ) : (
              rooms.map(({ id, name }) => (
                <li key={id} className={styles.roomItem}>
                  <p>{name}</p>

                  <Button
                    onClick={() => joinRoom(id)}
                    disabled={!playerNameSubmitted}
                  >
                    Join
                  </Button>
                </li>
              ))
            )}
          </ul>

          <div>
            <Button onClick={getRooms} disabled={!playerNameSubmitted}>
              Refresh Rooms
            </Button>
            <Button onClick={createRoom} disabled={!playerNameSubmitted}>
              Create Room
            </Button>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
