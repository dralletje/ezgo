import {range} from 'lodash'
import {isEqual} from 'lodash'

export let emptyBoard = size => {
  return range(0, size).map(() => range(0, size).map(() => 0))
}

let contains = (haystack, needle) => {
  return haystack.some(x => isEqual(x, needle))
}

let symbols = {
  '+': 0, // Empty
  '●': 1, // Black
  '○': 2, // White
}
let symbols_ = {
  '0': '+',
  '1': '●',
  '2': '○',
}

export let Colors = {
  NEUTRAL: 0,
  BLACK: 1,
  WHITE: 2,
}

let setBoard = (board, {x, y, color}) => {
  return board.map((xs, i) => {
    if (i !== x) {
      return xs
    } else {
      return xs.map((stone, j) => {
        if (j !== y) {
          return stone
        }

        return color
      })
    }
  })
}

let board2string = board => {
  return board
  .map(row => row.map(x => symbols_[x]).join('-'))
  .map(x => `-${x}-`)
  .join('\n')
}

let EDGES = [
  [-1,  0],
  [ 1,  0],
  [ 0, -1],
  [ 0,  1],
]

let findGroup = ({x, y, board, used = []}) => {
  // Take the base stone, group should be same color
  let stone = board[x][y]

  // Check every edge
  return EDGES.reduce((group, [dx, dy]) => {
    let _x = x + dx
    let _y = y + dy

    // If stone isn't same color, rip
    if ((board[_x] || [])[_y] !== stone) {
      return group
    }

    // If it already indexed by another grouper
    if (contains(used, [_x, _y])) {
      return group
    }

    return findGroup({
      board,
      x: _x,
      y: _y,
      used: used.concat(group),
    }).concat(group)
  }, [[x, y]])
}

let applyAttackWave = ({board, color}) => {
  let defender = color === 1 ? 2 : 1

  let grouped = board.reduce((state, row, x) => (
    row.reduce((groups, stone, y) => {
      if (stone !== defender) {
        return groups
      }

      // Check if the position is already 'in a group'
      if (groups.some(group => contains(group, [x, y]))) {
        return groups
      }

      let group = findGroup({ x, y, board })

      return groups.concat([group])
    }, state)
  ), [])

  let captured = grouped.filter(group =>
    group.every(([x, y]) =>
      EDGES.every(([dx, dy]) => {
        let edgeStone = ((board[x + dx] || []) [y + dy])
        return edgeStone !== Colors.NEUTRAL
      })
    )
  )

  let withCapturedRemoved = captured.reduce((_b, group) => (
    group.reduce((b, [x, y]) => (
      setBoard(b, {x, y, color: Colors.NEUTRAL})
    ), _b)
  ), board)

  return withCapturedRemoved
}

export let applyMove = (board, move) => {
  let newBoard = setBoard(board, move)
  let firstWave = applyAttackWave(({board: newBoard, color: move.color}))
  let secondWave = applyAttackWave(({board: firstWave, color: move.color === 1 ? 2 : 1}))

  return secondWave
}
