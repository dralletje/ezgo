import {range} from 'lodash'
import {isEqual, flatten} from 'lodash'

// Reduce with initial state as second argument
let reduce = (collection, accumulator, reducer) => collection.reduce(reducer, accumulator)

// Checks if array contains value that is equal deeply
let contains = (haystack, needle) => haystack.some(x => isEqual(x, needle))

// In an array, replace transform the value on a index using the specified map function
let mapIndex = (haystack, indexToReplace, mapFn) =>
  haystack.map((oldValue, index) => index === indexToReplace ? mapFn(oldValue) : oldValue)


// Generate an initial board with a gives size
export let emptyBoard = size => {
  return range(0, size).map(() => range(0, size).map(() => 0))
}

// Possible states a field can be in
export let Colors = {
  NEUTRAL: 0,
  BLACK: 1,
  WHITE: 2,
}

// Replace a stone on the board with another color
let updateBoard = (board, {x, y, color}) =>
  mapIndex(board, x, (row) => mapIndex(row, y, () => color))

// Get a stone from the board.
// Not a big deal, but looked a lot better than the actual code
let getBoard = (board, x, y) => (board[x] || [])[y]

// All sides that matter to a stone
let SIDES = [
  [-1,  0], [ 1,  0],
  [ 0, -1], [ 0,  1],
]

let findGroup = ({x, y, board, used = []}) => {
  // Take the base stone, group should be same color
  let stone = getBoard(board, x, y)

  // Check every edge
  // - Add the current stone as an initial value to the group
  return reduce(SIDES, [[x, y]], (group, [dx, dy]) => {
    let _x = x + dx
    let _y = y + dy

    // If stone isn't same color, rip
    if (getBoard(board, _x, _y) !== stone) {
      return group
    }

    // If it already indexed by another grouper
    if (contains(used, [_x, _y])) {
      return group
    }

    // Continue at the stone we just checked
    return findGroup({
      board,
      x: _x,
      y: _y,
      used: used.concat(group),
    })
    // Append the current group to the rest of the chain we find
    .concat(group)
  })
}

let applyAttackWave = ({board, color}) => {
  // Only stones of the defender actually matter here
  let defender = color === Colors.BLACK ? Colors.WHITE : Colors.BLACK

  // Collect groups of stones that are defending.
  // A group is are one or more stones that have a horizontal or vertical connection.

  // Groups are made by simply checking every stone, crawl as far as you can from every stone,
  // and keeping track of all stones already in a group, so we don't recrawl them.
  let defending_groups =
    // Go over...
    reduce(board, [], (groups_accumulator, row, x) => (
      // ...every stone
      reduce(row, groups_accumulator, (groups, stone, y) => {
        // Again, only care about defending stones
        if (stone !== defender) {
          return groups
        }

        // Check if the position is already 'in a group', if so, don't bother
        if (groups.some(group => contains(group, [x, y]))) {
          return groups
        }

        // Find the group this stone belongs to
        let group = findGroup({ x, y, board })

        // Move on to the next stone, saving this group from being recrawled
        return groups.concat([group])
      })
    ))

  // Find out which groups are totally taken over!
  let captured_groups =
    defending_groups.filter(stones =>
      // Check for every stone if it doesn't have...
      stones.every(([x, y]) =>
        // ...any side that is not...
        SIDES.every(([dx, dy]) =>
          // ...a neutral block.
          getBoard(board, x + dx, y + dy) !== Colors.NEUTRAL
          // Because if it doesn't have any...
        )
        // ...it only has allies, enemies or walls...
      )
      // ...meaning it is taken over 😭
    )

  // Now, to get actually rid of the stones taken over on the board,
  let captured_stones = flatten(captured_groups)
  let nextBoard =
    // we go over every taken stone...
    reduce(captured_stones, board, (board_acc, [x, y]) => (
      // ...and remove it from the board
      updateBoard(board_acc, {x, y, color: Colors.NEUTRAL})
    ))

  return nextBoard
}

export let applyMove = (board, move) => {
  // A move can only be applied to a now neutral stone
  if (getBoard(board, move.x, move.y) !== Colors.NEUTRAL) {
    throw new Error('The UI should prevent you from coming here anyway')
  }
  // Apply the move to the board, stupidly
  let newBoard = updateBoard(board, move)
  // Remove stones that were captured by this move
  let firstWave = applyAttackWave(({board: newBoard, color: move.color}))
  // Remove attackers stones! This only does something in case of suicide,
  // and that'll trigger an error later on 😅
  let secondWave = applyAttackWave(({board: firstWave, color: move.color === 1 ? 2 : 1}))

  return secondWave
}
