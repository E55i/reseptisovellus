import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react'

export default function UserCard({ user }) {
  return (
    <TouchableOpacity onPress={() => onSelect(recipe)}>
      <View>
        <Image source={{ uri: recipe.image }} />
        <Text>{recipe.name}</Text>
      </View>
    </TouchableOpacity>
  )
}