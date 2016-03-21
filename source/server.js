import SocketIO from 'socket.io'

import {emptyBoard, applyMove} from './go/go'
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

  socket.on('SEND_MOVE', ({move, game_id, move_id}) => {
    let game = go_games[game_id]

    // Not even trying to return an error here
    if (!game) {
      return
    }

    // Get the next board, hopefully without any error
    let nextBoard = applyMove(game.boards[0], move)
    let duplicateBoard = game.boards.findIndex(b => isEqual(b, nextBoard))
    if (duplicateBoard !== -1) {
      socket.emit('ILLEGAL_MOVE', {
        move_id,
        message: (
          duplicateBoard === 1
          ? 'That move is suicide!'
          : 'That move will lead to a situation that existed before.'
        ),
      })
      return
    }

    let newGame = {
      ...game,
      turn: game.turn === 'black' ? 'white' : 'black',
      boards: [nextBoard],
      lastMove: move,
    }
    socket.broadcast.to(game_id).emit('MOVE', move)
    socket.emit('ACK_MOVE', { move_id })

    console.log('Updating game', game_id, 'to', newGame)
    go_games[game_id] = newGame
  })
})
