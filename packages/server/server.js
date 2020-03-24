let SocketIO = require('socket.io')

let {emptyBoard, transition} = require('go-algorithm/go.js')
let {isEqual} = require('lodash');

let PORT = process.env.PORT || 8080;
let io = SocketIO(PORT)
console.log(`Listening on port '${PORT}'`);

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

    // Apply the transition!
    let {success, value} = transition(game, move)

    // If there was no error
    if (success) {
      // Send the move to other players
      socket.broadcast.to(game_id).emit('MOVE', move)
      // Let the sender know it can savely submit the move
      socket.emit('ACK_MOVE', { move_id })
      // Update the internal state (could be mysql?)
      go_games[game_id] = value
    } else {
      // If there was an error, let the sender know it was incorrect
      socket.emit('DEC_MOVE', { move_id, reason: value})
    }
  })
})
