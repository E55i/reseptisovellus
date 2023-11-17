import React from "react";
import { View, FlatList, Text } from "react-native";
import RecipeCard from "../components/RecipeCard";
import GoBackAppBar from '../components/GoBackAppBar';

const dummyData = [
  { id: "1", name: "Pasta", image: "https://example.com/pasta.jpg" },
  { id: "2", name: "Pizza", image: "https://example.com/pizza.jpg" },
  // ... lisää dataa
];

export default function SearchRecipe({ ...props }) {
  const onSelectRecipe = (recipe) => {
    // Logiikka reseptin valitsemiseen (esim. navigointi yksityiskohtiin)
  };

  /*return aiemmin:
      <View>
      <FlatList
        data={dummyData}
        renderItem={({ item }) => <RecipeCard recipe={item} onSelect={onSelectRecipe} />}
        keyExtractor={item => item.id}
      />
    </View>
      */

  return (
    <View>
      <GoBackAppBar {...props} />
      <FlatList
        data={dummyData}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onSelect={onSelectRecipe} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
