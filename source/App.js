import React from 'react'
import SocketIO from 'socket.io-client'

import {View} from './components/base'
import Game from './components/Game'

let socket = SocketIO('http://localhost:8080')

let App = () => {
  let match = window.location.pathname.match(/\/go\/(.+)/)
  if (!match) {
    return <View>aueKYGVFEuiaw;HAEFo;aefh:HOFAWf</View>
  }

  return <Game socket={socket} gameid={match[1]} />
}

export default App
