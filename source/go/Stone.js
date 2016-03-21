import React from 'react'
import {View} from '../components/base'

import {
  zwart, wit, undetermined,
  lastmovedstone,
  preview_zwart, preview_wit,
} from './Board.css'

let isLastMove = (move, x, y) => move && move.x === x && move.y === y

let colors = {
  '0': undetermined,
  '1': zwart,
  '2': wit,
}

let changed = {
  '1': preview_zwart,
  '2': preview_wit,
}

let Stone = ({
  x, y,
  lastMove,
  stone, previewStone,
  ...props,
}) => {
  return (
    <View
      {...props}
      className={[
        colors[stone],
        previewStone !== stone && changed[previewStone > 0 ? previewStone : stone],
        isLastMove(lastMove, x, y) && lastmovedstone,
      ].filter(Boolean).join(' ')}
    />
  )
}

export default Stone
