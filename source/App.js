import React from 'react'

import {View} from './components/base'
import Game from './components/Game'

let App = () => {
  let match = window.location.pathname.match(/\/go\/(.+)/)
  if (!match) {
    return <View>aueKYGVFEuiaw;HAEFo;aefh:HOFAWf</View>
  }

  return <Game gameid={match[1]} />
}

export default App
