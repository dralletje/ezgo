import React from "react";
import styled from "styled-components";
import { View } from "../components/base";

let isLastMove = (move, x, y) => move && move.x === x && move.y === y;

let colors = {
  "0": "undetermined",
  "1": "zwart",
  "2": "wit",
};

let changed = {
  "1": "preview_zwart",
  "2": "preview_wit",
};

let Stone = ({ x, y, lastMove, stone, previewStone, ...props }) => {
  return (
    <View
      {...props}
      className={[
        colors[stone],
        previewStone === 0 && "wrong_if_hovered",
        previewStone !== stone &&
          changed[previewStone > 0 ? previewStone : stone],
        isLastMove(lastMove, x, y) && "lastmovedstone",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
};

export default Stone;
