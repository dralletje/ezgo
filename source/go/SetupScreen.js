import React from 'react'
import {View} from '../components/base'

let SetupScreen = ({setState}) => {
  return (
    <View style={{flex: 1}}>
      <View>WHiCh ColOUR YoU WanT 2 🐝 ?</View>
      <View
        style={{
          backgroundColor: 'black',
          color: 'white',
          borderRadius: 5,
          padding: 10,
        }}
        onPress={() => setState({color: 'black'})}
        children="Black"
      />
      <View
        style={{
          backgroundColor: 'white',
          color: 'black',
          border: 'solid black 1px',
          borderRadius: 5,
          padding: 10,
        }}
        onPress={() => setState({color: 'white'})}
        children="White"
      />
    </View>
  )
}

export default SetupScreen
