import React from 'react'
import {View} from '../components/base'

import {card} from '../components/style.css'

import Button from '../components/Button'

import {onlyUpdateForKeys} from 'recompose'
import {score} from './go'

let scoreStyle = {
  justifyContent: 'flex-end',
  width: 70,
  height: 70,
  padding: 5,
  paddingBottom: 20,
  // fontSize: 14,
  fontWeight: 100,
  margin: 5,
  boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.19), inset 0 6px 6px rgba(0,0,0,0.23)',
}

let InfoBar = onlyUpdateForKeys(['color', 'turn', 'game'], ({color, turn, onPass, game}) => {
  let isMyTurn = color === turn

  let scores = score(game)

  let myColor = color === 'black' ? '#333' : 'white'
  let notMyColor = color === 'black' ? 'white' : '#333'

  return (
    <View style={{flexDirection: 'row', height: 100, width: 490, marginTop: 50}}>
      <View className={card} style={{flex: 1, marginRight: 20, flexDirection: 'row', padding: 10, textAlign: 'center'}}>

        <View
          style={{
            ...scoreStyle,
            backgroundColor: myColor,
            color: notMyColor,
          }}
          children={scores[color]}
        />

        <View
          style={{
            ...scoreStyle,
            backgroundColor: notMyColor,
            color: myColor,
          }}
          children={scores[color === 'black' ? 'white' : 'black']}
        />

        <Button
          style={{
            margin: 5,
            marginLeft: 20,
            flex: 1,
            fontSize: 14,
            letterSpacing: 1,
            fontWeight: 100,
            paddingBottom: 23,
          }}
          disabled={!isMyTurn}
          onPress={onPass}
        >Pass Turn</Button>
      </View>

      <View
        className={card}
        style={{
          width: 100,
          backgroundColor: turn,
          color: turn === 'black' ? 'white' : 'black',
          textAlign: 'center',
          paddingTop: 35,
        }}
      >
        <span style={{fontSize: 12}}>{isMyTurn ? 'YOUR' : 'OPPONENT'}</span>
        TURN
      </View>
    </View>
  )
})

export default InfoBar
