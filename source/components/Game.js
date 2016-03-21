import React from 'react'
import {isEqual} from 'lodash'

import {View} from './base'

import GameSocket from '../gameSocket'

import DocumentTitle from 'react-document-title'

import {applyMove} from '../go/go.js'
import SetupScreen from '../go/SetupScreen'
import Board from '../go/GoBoard'

import {notificationRequestBar} from './style.css'

import withNotificationPermission from '../hocs/withNotificationPermission'

let decorator = withNotificationPermission

class Game extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      color: null,
      boards: [],
      turn: null,
      lastMove: null,
      previewBoard: null,
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
        // Show last move more clearly
        lastMove: move,
      }
    })

    // Every new state that comes in, just apply it
    let disposable = socket.state$.subscribe(state => {
      if (state.turn === this.state.color) {
        this.props.Notification.create(`You're turn!`)
      }
      this.setState(state)
    })

    this.disposable = disposable
    this.socket = socket
  }

  componentWillUnmount() {
    this.disposable.dispose()
  }

  render() {
    let {boards, previewBoard, turn, lastMove, color} = this.state
    let {Notification} = this.props
    let [board] = boards
    let isMyTurn = turn === color

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

    let handleMove = (x, y) => {
      if (!isMyTurn) {
        return
      }

      let myColor = color === 'black' ? 1 : 2
      let move = {x, y, color: myColor}
      this.socket.applyMove(move)
    }

    let handlePreview = (x, y) => {
      if (!isMyTurn) {
        return
      }
      let myColor = color === 'black' ? 1 : 2
      let newBoard = applyMove(board, {x, y, color: myColor})
      this.setState({previewBoard: newBoard})
    }

    let handleClearPreview = () => {
      this.setState({
        previewBoard: null,
      })
    }

    let askForNotifications = () => {
      Notification.requestPermission()
    }

    return (
      <View>
        <DocumentTitle title={turn === color ? 'YOUR TURN!!!!!' : 'Waiting....'} />
        { Notification.permission === 'default' &&
          <View
            className={notificationRequestBar}
            onPress={askForNotifications}
            children="Allow me to notify you when it's your turn!"
          />
        }
        <Board
          lastMove={lastMove}
          color={color}
          turn={isMyTurn}
          value={board}
          previewBoard={previewBoard}

          onMove={handleMove}
          onPreview={handlePreview}
          onClearPreview={handleClearPreview}
        />
      </View>
    )
  }
}

export default decorator(Game)
