import React from 'react'
import {View} from '../components/base'

import {button, disabled as disabledClassName} from './button.css'
import {card} from '../components/style.css'

let Button = ({
  onPress, disabled, children,
  className,
  ...props,
}) => {
  return (
    <View
      className={[
        card,
        button,
        className,
        disabled && disabledClassName,
      ].filter(Boolean).join(' ')}
      onPress={onPress}
      {...props}
    >
      {children}
    </View>
  )
}

export default Button
