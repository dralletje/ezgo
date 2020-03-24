import React from "react";

import { View, Text } from "./base";

import DocumentTitle from "react-document-title";

import { applyMove, transition } from "go-algorithm/go";
import SetupScreen from "../go/SetupScreen";
import Board from "../go/GoBoard";
import InfoBar from "../go/InfoBar";
import Button from "../go/Button";

import { compose } from "recompose";
import { useNotification } from "../hocs/useNotification";
import { useGameSocket } from "../hocs/useGameSocket";

let decorator = compose();

let Game = ({ gameid }) => {
  let test = useGameSocket(gameid, transition, {
    boards: [],
    turn: null,
    lastMove: null,
  });
  console.log(`test:`, test);
  let { game, lastGameError, applyMove: applyGameMove } = test;
  let [color, set_color] = React.useState(null);
  let [previewBoard, set_previewBoard] = React.useState(null);

  let Notification = useNotification();

  console.log(`Notification:`, Notification);
  console.log(`lastGameError:`, lastGameError);

  let game_turn = game && game.turn;
  React.useEffect(() => {
    if (game_turn === color) {
      Notification.create(`You're turn!`);
    }
  }, [game_turn, color, Notification]);

  if (!color) {
    return (
      <View>
        <DocumentTitle title="EzGo - super ez go" />
        <SetupScreen setColor={(color) => set_color(color)} />
      </View>
    );
  }

  if (!game) {
    return (
      <View>
        <DocumentTitle title="Connecting..." />
        Setting up connection with the server...
      </View>
    );
  }

  let { boards, turn, lastMove } = game;
  let [board] = boards;
  let isMyTurn = turn === color;

  let handleMove = (x, y) => {
    if (!isMyTurn) {
      return;
    }

    let myColor = color === "black" ? 1 : 2;
    let move = { x, y, color: myColor };
    applyGameMove(move);
  };

  let handlePass = () => {
    if (!isMyTurn) {
      return;
    }
    let myColor = color === "black" ? 1 : 2;
    applyGameMove({ pass: true, color: myColor });
  };

  let handlePreview = (x, y) => {
    if (!isMyTurn) {
      return;
    }
    let myColor = color === "black" ? 1 : 2;
    let { success, value } = applyMove(board, { x, y, color: myColor });

    if (success) {
      set_previewBoard(value);
    } else {
      console.log("value:", value);
    }
  };

  let handleClearPreview = () => {
    set_previewBoard(null);
  };

  return (
    <View style={{ alignItems: "center", paddingBottom: 100, paddingTop: 50 }}>
      <DocumentTitle
        title={turn === color ? "YOUR TURN!!!!!" : "Waiting...."}
      />
      {Notification.permission === "default" && (
        <Button
          onPress={() => Notification.requestPermission()}
          stoneStyle={{ backgroundColor: color }}
          stoneClassName={Button.left}
          children=""
        >
          <Text
            style={{
              fontSize: 24,
              paddingBottom: 15,
            }}
            children="Enable Notifications!"
          />
        </Button>
      )}

      <Board
        lastMove={lastMove}
        color={color}
        turn={isMyTurn}
        value={board}
        previewBoard={previewBoard}
        onMove={handleMove}
        onPreview={handlePreview}
        onClearPreview={handleClearPreview}
      />

      <InfoBar turn={turn} color={color} onPass={handlePass} game={game} />
    </View>
  );
};

export default decorator(Game);
