import React from 'react'
import {View} from '../components/base'

import {card} from '../components/style.css'

import Button from '../components/Button'

let InfoBar = ({color, turn, onPass}) => {
  let isMyTurn = color === turn

  return (
    <View style={{flexDirection: 'row', height: 100, width: 490, marginTop: 50}}>
      <View className={card} style={{flex: 1, marginRight: 20, flexDirection: 'row', padding: 10, textAlign: 'center'}}>

        <View style={{flexDirection: 'column', flex: 1}}>
          <View style={{flexDirection: 'row', padding: 5}}>
            <View
              style={{
                backgroundColor: color === 'black' ? '#333' : 'white',
                width: 30,
                height: 30,
                marginRight: 10,
                boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.19), inset 0 6px 6px rgba(0,0,0,0.23)',
              }}
            />
          </View>

          <View style={{flexDirection: 'row', padding: 5}}>
            <View
              style={{
                backgroundColor: color === 'black' ? 'white' : '#333',
                width: 30,
                height: 30,
                boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.19), inset 0 6px 6px rgba(0,0,0,0.23)',
              }}
            />
          </View>
        </View>

        <View style={{width: 150}}>
          <Button
            style={{
              flex: 1,
              margin: 5,
              backgroundColor: 'darkblue',
              fontSize: 14,
              letterSpacing: 1,
              fontWeight: 100,
            }}
            disabled={!isMyTurn}
            onPress={onPass}
          >Pass Turn</Button>

          <Button
            style={{
              flex: 1,
              margin: 5,
              marginTop: 6,
              fontSize: 14,
              backgroundColor: 'darkgreen',
              fontWeight: 100,
            }}
            onPress={() => alert('NOTHING')}
          >Nothing!</Button>
        </View>
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
}

export default InfoBar
