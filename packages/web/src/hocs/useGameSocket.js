import React from "react";

import GameSocket from "./gameSocket";

export let useGameSocket = (gameid, transition, intialState) => {
  let [game, set_game] = React.useState(null);
  let [lastError, set_lastError] = React.useState(null);

  let socket = React.useRef(null);

  React.useEffect(() => {
    socket.current = GameSocket(gameid, intialState, transition);

    // Every new state that comes in, just apply it
    let disposable = socket.current.state$.subscribe((state) => {
      set_game(state);
    });

    let disposableError = socket.current.lastError$.subscribe((error) => {
      set_lastError(error);
    });

    return () => {
      disposable.dispose();
      disposableError.dispose();
      // Dispose socket?
    };
  }, []);

  let applyMove = (move) => {
    socket.current.applyMove(move);
  };

  return { applyMove, game, lastGameError: lastError };
};
