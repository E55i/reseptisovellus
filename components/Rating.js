import { View, Text } from 'react-native'
import React from 'react'

export default function Rating({ rating }) {
    return (
        <View>
            <View>
                <Text>{'⭐'.repeat(rating)}</Text>
            </View>
        </View>
    )
}