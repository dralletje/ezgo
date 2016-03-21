import React from 'react'
import {View} from './base'
import {stenen, zwart_aan_zet, wit_aan_zet, zwart, wit, undetermined} from './Board.css'

import Grid from './Grid'

let colors = {
  '0': undetermined,
  '1': zwart,
  '2': wit,
}

let Board = ({value, onMove, turn, color}) => {
  let colorClassName = color === 'black' ? zwart_aan_zet : wit_aan_zet
  return (
    <View style={{position: 'relative'}} className={turn && colorClassName}>
      <Grid width={value.length + 1} height={value.length + 1} />

      <View className={stenen}>
        { value.map((xs, i) =>
          <View key={i}>
            { xs.map((x, j) =>
              <View
                onClick={() => turn && onMove(i, j)}
                key={j}
                className={colors[x]}
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
