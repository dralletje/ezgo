import React from 'react'
import {isEqual} from 'lodash'

import {View} from './base'

import GameSocket from '../gameSocket'

import DocumentTitle from 'react-document-title'

import {applyMove} from '../go/go.js'
import SetupScreen from '../go/SetupScreen'
import Board from '../go/GoBoard'

class Game extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      color: null,
      boards: [],
      turn: null,
    }
  }

  componentDidMount() {
    let {gameid} = this.props

    let socket = GameSocket(gameid, this.state, ({boards}, move) => {
      // Take first board
      let [board] = boards
      // Apply the move to it
      let newBoard = applyMove(board, move)

      if (boards.some(b => isEqual(b, newBoard))) {
        alert('WHUT?!')
        throw new Error(`Noooooo`)
      }

      return {
        // Set the turn to whose turn it is now
        turn: move.color === 1 ? 'white' : 'black',
        // Prepend the newest board to the history of boards (and limit to 5)
        boards: [newBoard].concat(boards).slice(0, 5),
      }
    })

    // Every new state that comes in, just apply it
    let disposable = socket.state$.subscribe(state => {
      this.setState(state)
    })

    this.disposable = disposable
    this.socket = socket
  }

  componentWillUnmount() {
    this.disposable.dispose()
  }

  render() {
    let {boards, turn, color} = this.state
    let [board] = boards

    let handleMove = (x, y) => {
      let myColor = color === 'black' ? 1 : 2
      let move = {x, y, color: myColor}
      this.socket.applyMove(move)
    }

    if (!color) {
      return (
        <View>
          <DocumentTitle title="EzGo - super ez go" />
          <SetupScreen setState={state => this.setState(state)} />
        </View>
      )
    }

    if (!board) {
      return (
        <View>
          <DocumentTitle title="Connecting..." />
          Setting up connection with the server...
        </View>
      )
    }

    return (
      <View>
        <DocumentTitle title={turn === color ? 'YOUR TURN!!!!!' : 'Waiting....'} />
        <Board
          color={color}
          turn={turn === color}
          value={board}
          onMove={handleMove}
        />
      </View>
    )
  }
}

export default Game