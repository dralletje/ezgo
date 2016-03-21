import SocketIO from 'socket.io-client'
import {Observable, Subject} from 'rx'
import {SOCKET_ADDRESS} from './CONFIG'

let GameSocket = (game_id, intialState, moveToState) => {
  // let move_counter = 1
  let gameState = intialState
  let socket = SocketIO(SOCKET_ADDRESS)

  let errors$ = new Subject()
  let ownMoves$ = new Subject()

  // Send first message, expecting to get back more info
  socket.emit('JOIN_GAME', game_id)

  let applyMove = move => {
    // Calculate next state (make sure it's correct)
    let nextState = moveToState(gameState, move)

    // Optimistically goooooo
    ownMoves$.onNext(nextState)

    // Send move to the server
    socket.emit('SEND_MOVE', {
      game_id,
      move_id: 1,
      move: move,
    })
  }

  let movesFromServer$ = Observable.create(observer => {
    // This will deliver data every time we reconnect
    let initalDataListener = data => {
      console.log('data:', data)
      observer.onNext(data)
    }
    socket.on('GAME_DATA', initalDataListener)

    // On reconnect, ask again for the data
    let reconnectListener = () => {
      socket.emit('JOIN_GAME', game_id)
    }
    socket.on('reconnect', reconnectListener)

    // On move, update local state
    let moveListener = move => {
      let nextState = moveToState(gameState, move)
      observer.onNext(nextState)
    }
    socket.on('MOVE', moveListener)

    return () => {
      socket.removeEventListener(initalDataListener)
      socket.removeEventListener(reconnectListener)
      socket.removeEventListener(moveListener)
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
    errors$,
    applyMove,
  }
}

export default GameSocket
