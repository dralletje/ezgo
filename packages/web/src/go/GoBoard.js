import React from "react";
import { View } from "../components/base";
import { withState, compose } from "recompose";
import { random, range } from "lodash";
import styled from "styled-components/macro";

// import {
//   board,
//   board_background,
//   grid,
//   stenen,
//   zwart_aan_zet,
//   wit_aan_zet,
//   not_my_turn,
//   bottom_marker,
//   right_marker,
//   enable_markers,
// } from "./Board.css";

import Grid from "../components/Grid";
import Stone from "./Stone";

let BoardBackground = styled(View)`
  z-index: 10;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #eee;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
`;

let Stenen = styled(View)`
  z-index: 30;
  flex-direction: column;
  top: 0;
  left: 0;

  /* Row of stones */
  & div {
    flex-direction: row;
  }

  /* The actual stones. this includes stones that  */
  & div div {
    position: relative;
    width: 50px;
    height: 50px;

    transition: transform 0.2s ease-in;
  }

  & div div:after {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;
    right: 4px;
    content: "";
    display: block;
    background-color: transparant;

    /* Add a border radius anyway */
    border-radius: 25px;
  }

  /* Add an extra circle inside the stone that has been moved last */
  & div div:before {
    z-index: 100;
    content: "";
    display: block;
    border: 1px solid transparent;
    padding: 0;
    margin: auto;
    transition: all 0.5s;

    border-radius: 2px;
  }
`;

let BoardStyle = styled(View)`
  margin-top: 50px;
  align-self: center;
  /* So the absolute .stenen will be contained still */
  position: relative;

  padding: 20px;
  padding-bottom: 30px;

  /* Selected stones get .zwart or .wit */
  .preview_zwart:after,
  .zwart:after,
  .preview_wit:after,
  .wit:after,
  .wrong_if_hovered:hover:after {
    transition: transform 0.2s ease-in, box-shadow 0.2s ease-in,
      opacity 0.2s ease-in;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .preview_zwart:after,
  .zwart:after {
    background-color: black;
  }

  .preview_wit:after,
  .wit:after {
    background-color: white;
    /*border: solid black 1px;*/
  }

  .lastmovedstone:before {
    border-color: gray !important;
    padding: 7px !important;
  }

  /* Preview stones */
  .preview_zwart:after,
  .preview_wit:after {
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  }

  .preview_zwart,
  .preview_wit {
    cursor: pointer;
    transform: translateY(-5px);
  }

  .not_my_turn .wrong_if_hovered:after {
    opacity: 0 !important;
  }

  .wrong_if_hovered:hover:after {
    background-color: darkred;
    transition: none;
  }

  .preview_zwart:hover,
  .preview_wit:hover,
  .preview_zwart:hover:after,
  .preview_wit:hover:after {
    /*box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transform: translateY(0px);*/
    /*transition: none;*/
  }
`;

let Marker = styled(View)`
  /* Sidebar with markers */
  background-color: #bbb;
  position: absolute;
  /*z-index: -10;*/
  transition: left 0.5s, top 0.5s;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  cursor: pointer;

  & div {
    padding: 7px;
    color: #888;
    /* text-shadow: 0px -1px 1px #ddd; */
    font-size: 30px;
  }
`;

let BottomMarker = styled(Marker)`
  height: 50px;
  width: 450px;
  top: -10px;
  flex-direction: row;

  &:hover {
    top: -15px;
  }

  & div {
    padding-left: 14px;
    padding-right: 17px;
    padding-top: 5px;
  }

  .enable_markers & {
    top: -40px;
  }
  .enable_markers &:hover {
    top: -45px;
  }
`;

let RightMarker = styled(Marker)`
  height: 450px;
  width: 50px;
  left: -10px;
  padding: 5px;

  &:hover {
    left: -20px;
  }

  .enable_markers & {
    left: -40px;
  }
  .enable_markers &:hover {
    left: -45px;
  }
`;

let ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let getStone = (b, x, y, defaultStone) => {
  let row = (b || [])[x];
  let stone = (row || [])[y];

  return stone === undefined ? defaultStone : stone;
};

let noShake = { x: 0, y: 0 };
let Board = ({
  value,
  previewBoard,
  onMove,
  onPreview,
  onClearPreview,
  lastMove,
  turn,
  color,
}) => {
  let [shake, setShake] = React.useState(noShake);
  let [showMarkers, setShowMarkers] = React.useState(true);

  let shakeIt = () => {
    setShake({
      x: random(-3, 3, true),
      y: random(-3, 3, true),
    });
    setTimeout(() => {
      setShake(noShake);
    }, 75);
  };

  console.log(`showMarkers:`, showMarkers);

  let colorClassName = color === "black" ? ".zwart_aan_zet" : ".wit_aan_zet";
  return (
    <BoardStyle
      className={[
        turn ? colorClassName : "not_my_turn",
        showMarkers && "enable_markers",
      ]
        .filter(Boolean)
        .join(" ")}
      /*style={{
        transform: 'translate3d(0, 0, 0)',
        marginTop: shake.x,
        marginLeft: shake.y,
      }}*/
    >
      <BoardBackground />

      <BottomMarker
        onClick={() => {
          console.log(`showMarkers:`, showMarkers);
          setShowMarkers(!showMarkers);
        }}
      >
        {ALPHABET.slice(0, value.length).map((letter) => (
          <View key={letter}>{letter}</View>
        ))}
      </BottomMarker>

      <RightMarker onClick={() => setShowMarkers(!showMarkers)}>
        {range(0, value.length).map((digit) => (
          <View key={digit}>{digit + 1}</View>
        ))}
      </RightMarker>

      <Grid
        width={value.length + 1}
        height={value.length + 1}
        style={{
          zIndex: 20,
          transform: "translate(25px, 25px)",
        }}
      />

      <Stenen>
        {value.map((xs, i) => (
          <View key={i}>
            {xs.map((x, j) => (
              <Stone
                key={j}
                onClick={() => x === 0 && onMove(i, j)}
                onMouseEnter={() => x === 0 && onPreview(i, j)}
                onMouseLeave={() => onClearPreview()}
                x={i}
                y={j}
                lastMove={lastMove}
                stone={x}
                previewStone={getStone(previewBoard, i, j, x)}
              />
            ))}
          </View>
        ))}
      </Stenen>
    </BoardStyle>
  );
};

export default Board;
