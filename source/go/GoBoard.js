import React from 'react'
import {View} from '../components/base'
import {withState} from 'recompose'
import {random} from 'lodash'

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

let noShake = {x: 0, y: 0}
let Board = withState('shake', 'setShake', noShake, ({shake, setShake, value, onMove, lastMove, turn, color}) => {
  let shakeIt = () => {
    setShake({
      x: random(-3, 3, true),
      y: random(-3, 3, true),
    })
    setTimeout(() => {
      setShake(noShake)
    }, 75)
  }

  let colorClassName = color === 'black' ? zwart_aan_zet : wit_aan_zet
  return (
    <View
      className={board + ' ' + (turn ? colorClassName : '')}
      style={{
        transform: 'translate3d(0, 0, 0)',
        marginTop: shake.x,
        marginLeft: shake.y,
      }}
    >
      <Grid width={value.length + 1} height={value.length + 1} />

      <View className={stenen}>
        { value.map((xs, i) =>
          <View key={i}>
            { xs.map((x, j) =>
              <View
                onClick={() => {
                  if (turn) {
                    onMove(i, j)
                    //shakeIt()
                  }
                }}
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
})

export default Board
