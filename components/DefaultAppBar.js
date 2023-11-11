import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { AppBar, HStack, IconButton } from '@react-native-material/core'
import { FontAwesome } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'


export default function DefaultAppBar({backgroundColor, navigation}) {
  return (
    <AppBar
   backgroundColor={backgroundColor}
   trailing={props=>(
    <HStack
    >
      <IconButton
      icon={<Ionicons name="add" size={28} color="white" />}
      onPress={()=>{navigation.navigate('AddRecipe')}}
      {...props}
      />
      <IconButton
      icon={<Ionicons name="search-outline" size={28} color="white" />}
      onPress={()=>{navigation.navigate('SearchRecipe')}}
      {...props}
      />
      <IconButton
      icon={<FontAwesome name="user-circle-o" size={28} color="white" />}
      onPress={()=>{navigation.navigate('Profile')}}
      {...props}
      />
    </HStack>
   )}
   />
  )
}
const styles = StyleSheet.create({
  appbar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',    
  },
});