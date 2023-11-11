import React from 'react';
import { View, FlatList, Text} from 'react-native';
import RecipeCard from '../components/RecipeCard';

const dummyData = [
    { id: '1', name: 'Pasta', image: 'https://example.com/pasta.jpg' },
    { id: '2', name: 'Pizza', image: 'https://example.com/pizza.jpg' },
    // ... lisää dataa
  ];
 
export default function SearchRecipe() {

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

return (<View>
  <FlatList
    data={dummyData}
    renderItem={({item}) => <RecipeCard recipe={item} onSelect={onSelectRecipe} />}
    keyExtractor={item => item.id}
  />
</View>
  )
}