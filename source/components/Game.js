import React from 'react'
import {isEqual} from 'lodash'

import {View} from './base'
import Board from './Board'

import {emptyBoard, applyMove} from '../go.js'

class Game extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      boards: [],
      turn: null,
      color: null,
    }
  }

  componentDidMount() {
    let {gameid, socket} = this.props

    socket.emit('JOIN_GAME', gameid)

    socket.on('GAME_DATA', ({boards, turn}) => {
      this.setState({boards, turn})
    })

    socket.on('MOVE', ({turn, move}) => {
      let [board] = this.state.boards
      let newBoard = applyMove(board, move)
      this.setState({
        turn: turn,
        boards: [newBoard].concat(this.state.boards).slice(0, 5),
      })
    })
  }

  render() {
    let {boards, turn, color} = this.state
    let [board] = boards
    let {socket, gameid} = this.props

    console.log('color:', color)

    let handleMove = (x, y) => {
      let myColor = color === 'black' ? 1 : 2
      let notColor = color === 'black' ? 'white' : 'black'
      let move = {x, y, color: myColor}

      let newBoard = applyMove(board, move)

      if (boards.some(b => isEqual(b, newBoard))) {
        alert('WHUT?!')
        return
      }

      this.setState({
        // Only keep last 5 boards
        boards: [newBoard].concat(boards).slice(0, 5),
        turn: notColor,
      })
      socket.emit('SEND_MOVE', {
        id: gameid,
        move: move,
      })
    }

    if (!color) {
      return (
        <View style={{flex: 1}}>
          <View>WHiCh ColOUR YoU WanT 2 🐝 ?</View>
          <View
            style={{
              backgroundColor: 'black',
              color: 'white',
              borderRadius: 5,
              padding: 10,
            }}
            onPress={() => this.setState({color: 'black'})}
          >Black</View>
          <View
            style={{
              backgroundColor: 'white',
              color: 'black',
              border: 'solid black 1px',
              borderRadius: 5,
              padding: 10,
            }}
            onPress={() => this.setState({color: 'white'})}
          >White</View>
        </View>
      )
    }

    if (!board) {
      return <View />
    }

    return (
      <Board
        color={color}
        turn={turn === color}
        value={board}
        onMove={handleMove}
      />
    )
  }
}

export default Game
