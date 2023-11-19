import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function RecipeCard({
  recipeId,
  urlToImage,
  recipeName,
  cookTime,
  servingSize,
  prepTime,
  navigation,
  backgroundColor,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate("RecipeDetails", {
          recipeId: recipeId,
          backgroundColor: backgroundColor,
        });
      }}
    >
      {urlToImage ? (
        <Image style={styles.image} source={{ uri: urlToImage }} />
      ) : (
        <Image
          style={styles.image}
          source={require("../assets/image_placeholder.png")}
        />
      )}
      <View style={styles.recipeCardText}>
        <Text style={styles.recipeName}>{recipeName}</Text>
        <View style={styles.recipeInfo}>
          <View style={styles.servingSize}>
        <MaterialCommunityIcons
            style={styles.icon}
            name="account-group"
            size={18}
            color="#8B8B8B"
          />
          <Text style={styles.infoText}>{servingSize} hlö</Text>
          </View>
          <View style={styles.iconAndTextTime}>
          <Feather style={styles.icon} 
          name="clock" 
          size={16} 
          color="#8B8B8B" 
          />
          <Text style={styles.infoText}>{prepTime}</Text>
          <MaterialCommunityIcons
            style={styles.icon}
            name="toaster-oven"
            size={18}
            color="#8B8B8B"
          />
          <Text style={styles.infoText}>{cookTime}</Text>
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
    flexDirection: "column",
    justifyContent: 'center'
  },
  servingSize: {
    flexDirection: "row",
    justifyContent:'center',
  },
  iconAndTextTime: {
    flexDirection: "row",
    justifyContent:'center',
  },
  infoText: {
    fontSize: 12,
    paddingRight: 4,
  },
  icon: {
    paddingRight: 4,
  },
});
