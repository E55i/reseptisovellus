import React from "react";
import { View, Text, ScrollView, Button } from "react-native";
import GoBackAppBar from '../components/GoBackAppBar';
import RatingBar from "../components/RatingBar";

export default function RecipeDetails({route}) {

  const { recipeId, backgroundColor, navigation } = route.params;

  return (
    <View>
      <GoBackAppBar backgroundColor={backgroundColor}
        navigation={navigation} />
      <ScrollView>
        <Text>Tämä on recipeId: {recipeId}</Text>
        {/* Add an image component for the recipe here */}
        <Text>Ingredients:</Text>
        <Text>Ingredient 1, Ingredient 2, ...</Text>
        <Text>Instructions:</Text>
        <Text>Step-by-step instructions go here...</Text>
        <RatingBar/>
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
