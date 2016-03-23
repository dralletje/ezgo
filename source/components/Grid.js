import React from 'react'
import {View} from '../components/base'
import {range} from 'lodash'

let GRID_COLOR = 'gray'

let Grid = ({width, height, style = {}, ...props}) => {
  return (
    <View
      style={{
        position: 'absolute',
        borderStyle: 'solid',
        borderWidth: 0,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderColor: GRID_COLOR,
        ...style,
      }}
      {...props}
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
                borderColor: GRID_COLOR,

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

Grid.PropTypes = {
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
}

export default Grid
