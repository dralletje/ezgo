import React from "react";
import styled from "styled-components/macro";

import { View, Card } from "../components/base";

import Button from "../components/Button";

import { onlyUpdateForKeys } from "recompose";
import { score } from "go-algorithm/go";

let Komi = styled(View)`
  padding-top: 20px;
  position: absolute;
  top: 70px;
  left: 0;
  height: 70px;
  width: 70px;
  font-size: 10px;
  text-align: left;
  padding-left: 10px;

  transition: top 0.7s;
  & div {
    height: 10px;
  }
`;

let Scorefield = styled(View)`
  width: 70px;
  height: 70px;
  font-weight: 100;
  margin: 5px;
  box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.19),
    inset 0 6px 6px rgba(0, 0, 0, 0.23);

  position: relative;
  overflow: hidden;

  & > div:first-child {
    position: absolute;
    top: 0;
    left: 0;
    width: 70px;
    height: 70px;
    padding: 5px;
    padding-bottom: 20px;
    justify-content: flex-end;
    transition: top 0.7s;
  }

  &:hover ${Komi} {
    top: 0;
  }

  &:hover div:first-child {
    top: -70px;
  }
`;

let InfoBar = onlyUpdateForKeys(
  ["color", "turn", "game"],
  ({ color, turn, onPass, game }) => {
    let isMyTurn = color === turn;

    let scores = score(game);

    return (
      <View
        style={{ flexDirection: "row", height: 100, width: 490, marginTop: 50 }}
      >
        <Card
          style={{
            flex: 1,
            marginRight: 20,
            flexDirection: "row",
            padding: 10,
            textAlign: "center",
          }}
        >
          <Scorefield
            style={{
              backgroundColor: "#333",
              color: "white",
            }}
          >
            <View>{scores.black.total}</View>
            <Komi>
              <View children={`${scores.black.stones} placed`} />
              <View children={`+ ${scores.black.area} area`} />
              <View
                style={{ textDecoration: "line-through" }}
                children="+ 5.5 komi"
              />
            </Komi>
          </Scorefield>

          <Scorefield
            style={{
              backgroundColor: "white",
              color: "#333",
            }}
          >
            <View>{scores.white.total}</View>
            <Komi>
              <View children={`${scores.white.stones} placed`} />
              <View children={`+ ${scores.white.area} area`} />
              <View children="+ 5.5 komi" />
            </Komi>
          </Scorefield>

          <Button
            style={{
              margin: 5,
              marginLeft: 20,
              flex: 1,
              fontSize: 14,
              letterSpacing: 1,
              fontWeight: 100,
              paddingBottom: 23,
            }}
            disabled={!isMyTurn}
            onClick={onPass}
          >
            Pass Turn
          </Button>
        </Card>

        <Card
          style={{
            width: 100,
            backgroundColor: turn,
            color: turn === "black" ? "white" : "black",
            textAlign: "center",
            paddingTop: 35,
          }}
        >
          <span style={{ fontSize: 12 }}>{isMyTurn ? "YOUR" : "OPPONENT"}</span>
          TURN
        </Card>
      </View>
    );
  }
);

export default InfoBar;
