'use strict'

let expect = require('chai').expect

let go = require('../source/go/go')
let emptyBoard = go.emptyBoard
let applyMove = go.applyMove

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

let BoardtoString = board => {
  return board
  .map(row => row.map(x => symbols_[x]).join('-'))
  .map(x => `-${x}-`)
  .join('\n')
}

let str2board = str => {
  return str.split('\n')
    .map(line => line.replace(/[^●○+]/g, ''))
    .filter(onlySymbols => onlySymbols.length !== 0)
    .map(onlySymbols => onlySymbols.split('').map(x => symbols[x]))
}

let findMove = (oldBoard, newBoard) => {
  let move = null
  newBoard.some((row, i) =>
    row.some((stone, j) => {
      if (stone !== oldBoard[i][j]) {
        move = {x: i, y: j, color: stone}
        return true
      }
      return false
    })
  )

  if (!move) {
    throw new Error(`No move found between two boards`)
  }
  return move
}

let expectTransition = (oldBoard, newBoard, expectedBoard) => {
  let oldBoardParsed = str2board(oldBoard)
  let move = findMove(oldBoardParsed, str2board(newBoard))
  let appliedBoard = applyMove(oldBoardParsed, move)
  expect(appliedBoard).to.eql(str2board(expectedBoard))
}

describe('go.js', () => {

  it('should generate an empty board', () => {
    let board = emptyBoard(5)
    expect(board).to.eql(str2board(`
      -+-+-+-+-+-
      -+-+-+-+-+-
      -+-+-+-+-+-
      -+-+-+-+-+-
      -+-+-+-+-+-
    `))
  })

  it('should apply a first move', () => {
    expectTransition(`
      -+-+-+-
      -+-+-+-
      -+-+-+-
    `, `
      -●-+-+-
      -+-+-+-
      -+-+-+-
    `, `
      -●-+-+-
      -+-+-+-
      -+-+-+-
    `)
  })

  it('should apply a simple move', () => {
    expectTransition(`
      -○-●-+-
      -+-●-+-
      -+-+-+-
    `, `
      -○-●-+-
      -+-●-○-
      -+-+-+-
    `, `
      -○-●-+-
      -+-●-○-
      -+-+-+-
    `)
  })

  it('should capture when surrounded in corner', () => {
    expectTransition(`
      -○-●-+-
      -+-+-+-
      -+-+-+-
    `, `
      -○-●-+-
      -●-+-+-
      -+-+-+-
    `, `
      -+-●-+-
      -●-+-+-
      -+-+-+-
    `)
  })

  it.only('should capture when surrounded - multiple', () => {
    expectTransition(`
      -○-●-+-
      -○-●-+-
      -○-+-+-
    `, `
      -○-●-+-
      -○-●-+-
      -○-●-+-
    `, `
      -+-●-+-
      -+-●-+-
      -+-●-+-
    `)

    expectTransition(`
      -○-●-+-
      -○-●-+-
      -○-+-+-
    `, `
      -○-●-+-
      -○-●-+-
      -○-●-+-
    `, `
      -+-●-+-
      -+-●-+-
      -+-●-+-
    `)

    expectTransition(`
      -○-●-+-
      -○-○-+-
      -○-○-○-
    `, `
      -○-●-+-
      -○-○-●-
      -○-○-○-
    `, `
      -+-●-+-
      -+-+-●-
      -+-+-+-
    `)

    expectTransition(`
      -○-○-+-
      -○-○-○-
      -○-○-○-
    `, `
      -○-○-●-
      -○-○-○-
      -○-○-○-
    `, `
      -+-+-●-
      -+-+-+-
      -+-+-+-
    `)

    expectTransition(`
      -+-●-○-
      -+-+-+-
      -+-+-+-
    `, `
      -+-●-○-
      -+-+-●-
      -+-+-+-
    `, `
      -+-●-+-
      -+-+-●-
      -+-+-+-
    `)
  })
})
