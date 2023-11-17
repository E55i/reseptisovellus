import React from "react";
import { View, Text, ScrollView, Button } from "react-native";
import GoBackAppBar from '../components/GoBackAppBar';

export default function RecipeDetails({ ...props }) {
  return (
    <View>
      <GoBackAppBar {...props} />
      <ScrollView>
        <Text>Recipe Name</Text>
        {/* Add an image component for the recipe here */}
        <Text>Ingredients:</Text>
        <Text>Ingredient 1, Ingredient 2, ...</Text>
        <Text>Instructions:</Text>
        <Text>Step-by-step instructions go here...</Text>
        <Text>Comments:</Text>
        {/* List comments here */}
        <Text>Add Comment:</Text>
        {/* Add a TextInput for adding comments here */}
        <Button
          title="Submit Comment"
          onPress={() => {
            /* Commenting logic here */
          }}
        />
      </ScrollView>
    </View>
  );
}
