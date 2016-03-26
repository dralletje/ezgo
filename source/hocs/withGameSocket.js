import React from 'react'

import GameSocket from './gameSocket'

let withGameSocket = (gameIdSelector, transition, intialState) => Component => {
  return class WithGameSocket extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.state = {game: null, lastError: null}
    }

    componentDidMount() {
      let gameid = gameIdSelector(this.props)

      let socket = GameSocket(gameid, intialState, transition)

      // Every new state that comes in, just apply it
      let disposable = socket.state$.subscribe(state => {
        this.setState({game: state})
      })

      let disposableError = socket.lastError$.subscribe(error => {
        this.setState({lastError: error})
      })

      this.disposables = [disposable, disposableError]
      this.socket = socket
    }

    componentWillUnmount() {
      this.disposable.forEach(x => x.dispose())
    }

    render() {
      let {game, lastError} = this.state

      let applyMove = move => {
        this.socket.applyMove(move)
      }

      return (
        <Component
          {...this.props}
          applyMove={applyMove}
          game={game}
          lastGameError={lastError}
        />
      )
    }
  }
}

export default withGameSocket
