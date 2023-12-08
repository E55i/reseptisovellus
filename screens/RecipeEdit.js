import { View, Text, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import GoBackAppBar from "../components/GoBackAppBar";
import { GetSingleRecipe } from "../components/GetRecipes";
import { Colors } from "../styles/Colors";

export default function RecipeEdit({ route, ...props }) {
  const recipeId = route.params.recipeId;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  return (
    <>
      <GoBackAppBar {...props} />
      <GetSingleRecipe
        recipeId={recipeId}
        setData={(data) => {
          setData(data);
          setLoading(false);
        }}
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          animating={true}
          color={Colors.secondary}
        />
      ) : (
        <View>
          <Text>RecipeEdit, Title: {data.title}</Text>
        </View>
      )}
    </>
  );
}
