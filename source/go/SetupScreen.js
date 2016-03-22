import React from 'react'
import {View} from '../components/base'

import {card} from '../components/style.css'
import {title} from './setupscreen.css'

import Button from './Button'

let SetupScreen = ({setState}) => {
  return (
    <View style={{flex: 1, textAlign: 'center', width: 'auto', margin: 'auto'}}>
      <View className={title}>WHiCh ColOUR YoU WanT 2 🐝 ?</View>

      <Button
        onPress={() => setState({color: 'black'})}
        stoneStyle={{backgroundColor: 'black'}}
        stoneClassName={Button.down}
        children="BLACK"
      />

      <Button
        onPress={() => setState({color: 'white'})}
        stoneStyle={{backgroundColor: 'white'}}
        stoneClassName={Button.right}
        children="WHITE"
      />
    </View>
  )
}

export default SetupScreen
