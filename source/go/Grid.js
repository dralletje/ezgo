import React from 'react'
import {View} from '../components/base'
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
        transform: 'translate(25px, 25px)',
      }}
    >
      { range(1, height - 1).map(x =>
        <View key={x} style={{flexDirection: 'row'}}>
          { range(1, width - 1).map(y =>
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
