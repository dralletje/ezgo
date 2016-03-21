import SocketIO from 'socket.io'

import {emptyBoard, applyMove} from './go'
import {isEqual} from 'lodash'

let io = SocketIO(8080)

let go_games = {}

io.on('connection', (socket) => {
  socket.on('JOIN_GAME', (id) => {
    let game = go_games[id] || {
      turn: 'black',
      boards: [emptyBoard(9)],
    }

    socket.emit('GAME_DATA', game)
    socket.join(id)
    go_games[id] = game
  })

  socket.on('SEND_MOVE', ({move, id}) => {
    console.log('MoVEEEEeeeee', id)
    let game = go_games[id]

    if (!game) {
      console.log('Unknown game')
      return
    }

    let nextBoard = applyMove(game.boards[0], move)
    if (game.boards.some(b => isEqual(b, nextBoard))) {
      console.log('Illegal move')
      return
    }

    let newGame = {
      ...game,
      turn: game.turn === 'black' ? 'white' : 'black',
      boards: [nextBoard],
    }
    io.to(id).emit('MOVE', {
      turn: newGame.turn,
      move: move,
    })
    go_games[id] = newGame
  })
})
