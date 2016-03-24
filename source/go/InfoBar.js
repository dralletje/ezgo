import React from 'react'
import {View} from '../components/base'

import {card} from '../components/style.css'

import Button from '../components/Button'

import {onlyUpdateForKeys} from 'recompose'
import {score} from './go'

import {komi, scorefield} from './infobar.css'

let InfoBar = onlyUpdateForKeys(['color', 'turn', 'game'], ({color, turn, onPass, game}) => {
  let isMyTurn = color === turn

  let scores = score(game)

  return (
    <View style={{flexDirection: 'row', height: 100, width: 490, marginTop: 50}}>
      <View className={card} style={{flex: 1, marginRight: 20, flexDirection: 'row', padding: 10, textAlign: 'center'}}>

        <View
          className={scorefield}
          style={{
            backgroundColor: '#333',
            color: 'white',
          }}
        >
          <View>{scores.black.total}</View>
          <View className={komi}>
            <View children={`${scores.black.stones} placed`} />
            <View children={`+ ${scores.black.area} area`} />
            <View style={{textDecoration: 'line-through'}} children="+ 5.5 komi" />
          </View>
        </View>

        <View
          className={scorefield}
          style={{
            backgroundColor: 'white',
            color: '#333',
          }}
        >
          <View>{scores.white.total}</View>
          <View className={komi}>
            <View children={`${scores.white.stones} placed`} />
            <View children={`+ ${scores.white.area} area`} />
            <View children="+ 5.5 komi" />
          </View>
        </View>

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
