import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function RecipeCard({ recipe, onSelect }) {
    return (
        <TouchableOpacity onPress={() => onSelect(recipe)}>
          <View>
            <Image source={{ uri: recipe.image }} />
            <Text>{recipe.name}</Text>
          </View>
        </TouchableOpacity>
      )
    }