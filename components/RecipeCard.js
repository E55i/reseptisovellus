import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function RecipeCard({recipeId, urlToImage, recipeName, cookTime, servingSize}) {
 
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        /*Show recipe, use recipeId*/
      }}
    >
      {urlToImage ? (<Image style={styles.image} source={{ uri: urlToImage }} />) :  <Image style={styles.image} source={require('../assets/image_placeholder.png')} />} 
      <View style={styles.recipeCardText}>
        <Text style={styles.recipeName}>{recipeName}</Text>
        <View style={styles.recipeInfo}>
          <View style={styles.iconAndTextTime}>
            <Feather
              style={styles.icon}
              name="clock"
              size={18}
              color="#8B8B8B"
            />
            <Text style={styles.infoText}>{cookTime} h</Text>
          </View>
          <View style={styles.iconAndTextPortion}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="account-group"
              size={18}
              color="#8B8B8B"
            />
            <Text style={styles.infoText}>{servingSize} hlö</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    borderRadius: 10,
    borderColor: "#47A73E",
    borderWidth: 2,
    padding: 8,
    margin: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 36,
    marginLeft: 2,
  },
  recipeCardText: {
    flexDirection: "column",
    flex: 1,
    maxWidth: 200,
    alignItems: "center",
    flexWrap: "wrap",
  },
  recipeName: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 12,
  },
  recipeInfo: {
    flexDirection: "row",
  },
  iconAndTextTime: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  iconAndTextPortion: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  infoText: {
    fontSize: 12,
  },
  icon: {
    paddingRight: 4,
  },
});
