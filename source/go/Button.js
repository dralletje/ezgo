import React from 'react'
import {View} from '../components/base'

import {
  button, field, text, stone,
  left, right, up, down,
} from './button.css'
import {card} from '../components/style.css'

let Button = ({
  onPress, children,
  stoneClassName, stoneStyle,
}) => {
  return (
    <View
      className={card + ' ' + button}
      onPress={onPress}
    >
      <View className={field}>
        <View />
        <View className={stone + ' ' + stoneClassName} style={stoneStyle} />
        <View />
      </View>

      <View className={text}>{children}</View>
    </View>
  )
}

Object.assign(Button, {left, right, up, down})

export default Button
