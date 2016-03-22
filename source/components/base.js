import React from 'react'

import {View as ViewClass} from './style.css'

export let View = ({className, onPress, ...props}) => {
  return (
    <div
      className={ViewClass + ' ' + (className || '')}
      onClick={onPress}
      {...props}
    />
  )
}

export let Text = 'span'
