import React from 'react'

import {View as ViewClass} from './Board.css'

export let View = ({className, onPress, ...props}) => {
  return (
    <div
      className={ViewClass + ' ' + (className || '')}
      onClick={onPress}
      {...props}
    />
  )
}
