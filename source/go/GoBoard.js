import React from 'react'
import {View} from '../components/base'
import {withState, compose} from 'recompose'
import {random, range} from 'lodash'

import {
  board, board_background, grid, stenen,
  zwart_aan_zet, wit_aan_zet,
  not_my_turn,
  bottom_marker, right_marker, enable_markers,
} from './Board.css'

import Grid from '../components/Grid'
import Stone from './Stone'

let ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

let getStone = (b, x, y, defaultStone) => {
  let row = (b || [])[x]
  let stone = (row || [])[y]

  return stone === undefined ? defaultStone : stone
}

let noShake = {x: 0, y: 0}
let Board = compose(
  withState('shake', 'setShake', noShake),
  withState('showMarkers', 'setShowMarkers', false)
)(({
  shake, setShake,
  value, previewBoard, onMove,
  onPreview, onClearPreview,
  lastMove, turn, color,

  showMarkers, setShowMarkers,
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
      className={[
        board,
        (turn ? colorClassName : not_my_turn),
        showMarkers && enable_markers,
      ].filter(Boolean).join(' ')}
      /*style={{
        transform: 'translate3d(0, 0, 0)',
        marginTop: shake.x,
        marginLeft: shake.y,
      }}*/
    >
      <View className={board_background} />

      <View className={bottom_marker} onPress={() => setShowMarkers(!showMarkers)}>
        { ALPHABET.slice(0, value.length).map(letter =>
          <View key={letter}>{letter}</View>
        )}
      </View>

      <View className={right_marker} onPress={() => setShowMarkers(!showMarkers)}>
        { range(0, value.length).map(digit =>
          <View key={digit}>{digit + 1}</View>
        )}
      </View>

      <Grid
        width={value.length + 1}
        height={value.length + 1}
        className={grid}
        style={{
          transform: 'translate(25px, 25px)',
        }}
      />

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
