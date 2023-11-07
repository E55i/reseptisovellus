import { View, Text } from 'react-native'
import React from 'react'

export default function CommentBox({ comment }) {
  return (
    <View>
    <Text>{comment.user}</Text>
    <Text>{comment.text}</Text>
  </View>
  )
}