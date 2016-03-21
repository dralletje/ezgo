import React from 'react'
import {View} from '../components/base'
import {
  board, stenen,
  zwart_aan_zet, wit_aan_zet,
  zwart, wit, undetermined,
  lastmovedstone,
} from './Board.css'

import Grid from './Grid'

let colors = {
  '0': undetermined,
  '1': zwart,
  '2': wit,
}

let isLastMove = (move, x, y) => move && move.x === x && move.y === y

let Board = ({value, onMove, lastMove, turn, color}) => {
  let colorClassName = color === 'black' ? zwart_aan_zet : wit_aan_zet
  return (
    <View className={board + ' ' + (turn ? colorClassName : '')}>
      <Grid width={value.length + 1} height={value.length + 1} />

      <View className={stenen}>
        { value.map((xs, i) =>
          <View key={i}>
            { xs.map((x, j) =>
              <View
                onClick={() => turn && onMove(i, j)}
                key={j}
                className={[
                  colors[x],
                  isLastMove(lastMove, i, j) && lastmovedstone,
                ].filter(Boolean).join(' ')}
              />
            )}
          </View>
          )
        }
      </View>
    </View>
  )
}

export default Board
