import SocketIO from 'socket.io-client'
import {Observable, Subject} from 'rx'
import {SOCKET_ADDRESS} from './CONFIG'

let listen = (socket, event, listener) => {
  socket.on(event, listener)
  return () => socket.removeEventListener(event, listener)
}

let GameSocket = (game_id, intialState, moveToState) => {
  let move_counter = 1
  let gameState = intialState
  let socket = SocketIO(SOCKET_ADDRESS)

  let lastError$ = new Subject()
  let ownMoves$ = new Subject()

  // Send first message, expecting to get back more info
  socket.emit('JOIN_GAME', game_id)

  let gamesCache = {}

  let applyMove = move => {
    // Calculate next state (make sure it's correct)
    let {success, value, ...hmmm} = moveToState(gameState, move)
    if (success) {
      let move_id = move_counter

      // Increment move counter
      move_counter = move_counter + 1
      // Save current move in 'cache'
      gamesCache[move_id] = gameState
      // Send move to the server
      socket.emit('SEND_MOVE', { game_id, move_id, move })
      // Optimistically goooooo
      ownMoves$.onNext(value)
    } else {
      lastError$.onNext({message: value})
    }
  }

  let movesFromServer$ = Observable.create(observer => {
    let ACK_listener = listen(socket, 'ACK_MOVE', ({ move_id }) => {
      console.log(`Yesss, move ${move_id} acknowledged`)
      gamesCache[move_id] = undefined
    })
    let DEC_listener = listen(socket, 'DEC_MOVE', ({ move_id, reason }) => {
      console.log(`Ajj, move ${move_id} is declined!`)
      lastError$.onNext({message: reason})
      ownMoves$.onNext(gamesCache[move_id])
      gamesCache[move_id] = undefined
    })

    // This will deliver data every time we reconnect
    let initalDataListener = listen(socket, 'GAME_DATA', data => {
      console.log('data:', data)
      observer.onNext(data)
    })

    // On reconnect, ask again for the data
    let reconnectListener = listen(socket, 'reconnect', () => {
      socket.emit('JOIN_GAME', game_id)
    })

    // On move, update local state
    let moveListener = listen(socket, 'MOVE', move => {
      let {success, value} = moveToState(gameState, move)
      if (success) {
        observer.onNext(value)
      } else {
        console.log('This stuff gets weird...', value)
      }
    })

    return () => {
      initalDataListener()
      reconnectListener()
      moveListener()
      ACK_listener()
      DEC_listener()
    }
  }).share()

  let state$ = Observable.merge(movesFromServer$, ownMoves$)

  // Every move or data that comes in, should be applied to the total state
  state$.subscribe(state => {
    console.log('state:', state)
    gameState = {
      ...gameState,
      ...state,
    }
  })

  // Just log connection errors for now
  socket.on('connect_error', err => {
    console.log('connect err:', err)
  })

  socket.on('error', error => {
    console.log('error:', error)
  })

  return {
    state$,
    lastError$,
    applyMove,
  }
}

export default GameSocket
