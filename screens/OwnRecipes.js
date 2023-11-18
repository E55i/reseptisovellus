import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import GetOwnRecipes from "../components/GetOwnRecipes";
import { Colors } from "../styles/Colors";
import GoBackAppBar from "../components/GoBackAppBar";

export default function OwnRecipes({ ...props }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <GoBackAppBar {...props} />
      <View style={styles.container}>
        <ScrollView style={{ margin: 20 }}>
          <GetOwnRecipes
            setData={(recipes) => {
              setRecipes(recipes);
              setLoading(false);
            }}
            order={"created"} // if you want to order by some other feature, add 'recipeData.' before the featurename, e.g. "recipeData.title"
            orderDirection={"desc"}
          />
          {loading ? (
            <ActivityIndicator size="large" animating={true} />
          ) : (
            <>
              {recipes.map((recipe) => (
                <View key={recipe.id} style={styles.recipeContainer}>
                  <View>
                    <Text>{recipe.created}</Text>
                  </View>
                  <View>
                    <Text style={styles.header}>{recipe.title}</Text>
                  </View>
                  <View>
                    <Text>Annoskoko: {recipe.servingSize}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  recipeContainer: {
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 16,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.primary,
    backgroundColor: "white",
    shadowColor: "#000000",
    ...Platform.select({
      android: {
        elevation: 7,
        overflow: "hidden",
      },
    }),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
