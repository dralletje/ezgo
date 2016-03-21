import React from 'react'
import {View} from './base'
import {range} from 'lodash'

let Grid = ({width, height}) => {
  return (
    <View
      style={{
        borderStyle: 'solid',
        borderWidth: 0,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderColor: 'black',
      }}
    >
      { range(0, height).map(x =>
        <View key={x} style={{flexDirection: 'row'}}>
          { range(0, width).map(y =>
            <View
              key={y}
              style={{
                borderStyle: 'solid',
                borderWidth: 0,
                borderBottomWidth: 1,
                borderRightWidth: 1,
                borderColor: 'black',

                width: 50,
                height: 50,
              }}
            />
          )}
        </View>
        )
      }
    </View>
  )
}

export default Grid
