import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';

const dummyProfileData = [
    { id: '1', name: 'Pasta', rating: 5 },
    { id: '2', name: 'Pizza', rating: 4 },
    // ... more data
  ];

export default function Profile() {
    return (
        <View>
          <Text>User's Profile</Text>
          <Text>Email: user@example.com</Text>
          <Text>My Recipes:</Text>
          <FlatList
            data={dummyProfileData}
            renderItem={({ item }) => (
              <View>
                <Text>{item.name} (Rating: {item.rating})</Text>
                <Button title="View" onPress={() => { /* Navigate to recipe details */ }} />
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )
}