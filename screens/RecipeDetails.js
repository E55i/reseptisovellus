import React from "react";
import { View, Text, ScrollView, Button } from "react-native";
import GoBackAppBar from '../components/GoBackAppBar';
import RatingBar from "../components/RatingBar";
import { useNavigation } from "@react-navigation/native";
import Rating from "../components/Rating";

export default function RecipeDetails({route}) {

  const { recipeId, backgroundColor } = route.params;
  const navigation = useNavigation();

  return (
    <View>
      <GoBackAppBar backgroundColor={backgroundColor}
        navigation={navigation} />
      <ScrollView>
        <Text>Tämä on recipeId: {recipeId}</Text>
        {/*Tähän tulee tietokannasta haettu rating, 
        nyt näön vuoksi laitettu jokin arvosana, jotta komponentti näkyy näytöllä*/}
        <Rating rating={3.2}/>
        {/* Add an image component for the recipe here */}
        <Text>Ingredients:</Text>
        <Text>Ingredient 1, Ingredient 2, ...</Text>
        <Text>Instructions:</Text>
        <Text>Step-by-step instructions go here...</Text>
        <RatingBar recipeId={recipeId}/>
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
