import React from 'react'
import {View} from '../components/base'
import {withState} from 'recompose'
import {random} from 'lodash'

import {
  board, stenen,
  zwart_aan_zet, wit_aan_zet,
  not_my_turn,
} from './Board.css'

import Grid from './Grid'
import Stone from './Stone'

let getStone = (b, x, y, defaultStone) => {
  let row = (b || [])[x]
  let stone = (row || [])[y]

  return stone === undefined ? defaultStone : stone
}

let noShake = {x: 0, y: 0}
let Board = withState('shake', 'setShake', noShake, ({
  shake, setShake,
  value, previewBoard, onMove,
  onPreview, onClearPreview,
  lastMove, turn, color,
}) => {
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
      className={board + ' ' + (turn ? colorClassName : not_my_turn)}
      /*style={{
        transform: 'translate3d(0, 0, 0)',
        marginTop: shake.x,
        marginLeft: shake.y,
      }}*/
    >
      <Grid width={value.length + 1} height={value.length + 1} />

      <View className={stenen}>
        { value.map((xs, i) =>
          <View key={i}>
            { xs.map((x, j) =>
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
            )}
          </View>
          )
        }
      </View>
    </View>
  )
})

export default Board
