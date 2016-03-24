import React from 'react'
import {isEqual} from 'lodash'

import {View, Text} from './base'

import GameSocket from '../gameSocket'

import DocumentTitle from 'react-document-title'

import {applyMove, transition} from '../go/go.js'
import SetupScreen from '../go/SetupScreen'
import Board from '../go/GoBoard'
import InfoBar from '../go/InfoBar'
import Button from '../go/Button'

import {notificationRequestBar, card} from './style.css'

import withNotificationPermission from '../hocs/withNotificationPermission'

let decorator = withNotificationPermission

class Game extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      color: null,
      previewBoard: null,
      game: null,
    }
  }

  componentDidMount() {
    let {gameid} = this.props

    let socket = GameSocket(gameid, {
      boards: [],
      turn: null,
      lastMove: null,
    }, transition)

    // Every new state that comes in, just apply it
    let disposable = socket.state$.subscribe(state => {
      if (state.turn === this.state.color) {
        this.props.Notification.create(`You're turn!`)
      }
      this.setState({game: state})
    })

    let disposableError = socket.lastError$.subscribe(error => {
      alert(error.message)
    })

    this.disposables = [disposable, disposableError]
    this.socket = socket
  }

  componentWillUnmount() {
    this.disposable.forEach(x => x.dispose())
  }

  render() {
    let {previewBoard, game, color} = this.state
    let {Notification} = this.props

    if (!color) {
      return (
        <View>
          <DocumentTitle title="EzGo - super ez go" />
          <SetupScreen setState={state => this.setState(state)} />
        </View>
      )
    }

    if (!game) {
      return (
        <View>
          <DocumentTitle title="Connecting..." />
          Setting up connection with the server...
        </View>
      )
    }

    let {boards, turn, lastMove} = game
    let [board] = boards
    let isMyTurn = turn === color

    let handleMove = (x, y) => {
      if (!isMyTurn) {
        return
      }

      let myColor = color === 'black' ? 1 : 2
      let move = {x, y, color: myColor}
      this.socket.applyMove(move)
    }

    let handlePass = () => {
      if (!isMyTurn) {
        return
      }
      let myColor = color === 'black' ? 1 : 2
      this.socket.applyMove({pass: true, color: myColor})
    }

    let handlePreview = (x, y) => {
      if (!isMyTurn) {
        return
      }
      let myColor = color === 'black' ? 1 : 2
      let {success, value} = applyMove(board, {x, y, color: myColor})

      if (success) {
        this.setState({previewBoard: value})
      } else {
        console.log('value:', value)
      }
    }

    let handleClearPreview = () => {
      this.setState({
        previewBoard: null,
      })
    }

    return (
      <View style={{alignItems: 'center', paddingBottom: 100, paddingTop: 50}}>
        <DocumentTitle title={turn === color ? 'YOUR TURN!!!!!' : 'Waiting....'} />
        { Notification.permission === 'default' &&
          <Button
            onPress={() => Notification.requestPermission()}
            stoneStyle={{backgroundColor: color}}
            stoneClassName={Button.left}
            children=""
          >
            <Text
              style={{
                fontSize: 24,
                paddingBottom: 15,
              }}
              children="Enable Notifications!"
            />
          </Button>
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

        <InfoBar
          turn={turn}
          color={color}
          onPass={handlePass}
          game={game}
        />
      </View>
    )
  }
}

export default decorator(Game)
