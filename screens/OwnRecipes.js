import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image
} from "react-native";
import GetOwnRecipes from "../components/GetOwnRecipes";
import { Colors } from "../styles/Colors";
import GoBackAppBar from "../components/GoBackAppBar";
import RecipeCard from "../components/RecipeCard";

export default function OwnRecipes({ ...props }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <GoBackAppBar {...props} />
      <View style={styles.container}>
        <ScrollView>
          <GetOwnRecipes
            setData={(recipes) => {
              setRecipes(recipes);
              setLoading(false);
            }}
            order={"created"} // if you want to order by some other feature, add 'recipeData.' before the featurename, e.g. "recipeData.title"
            orderDirection={"desc"}
          />
          {recipes.length > 0 ? (
            loading ? (
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
                color={Colors.secondary}
              />
            ) : (
              <>
                <Text style={styles.heading}>Lisäämäsi reseptit</Text>
                {recipes.map((item) => (
                  <RecipeCard
                    key={item.id}
                    recipeId={item.id}
                    prepTime={item.prepTime}
                    urlToImage={item.photo}
                    recipeName={item.title}
                    cookTime={item.cookTime}
                    servingSize={item.servingSize}
                    premium={item.premium}
                  />
                ))}
              </>
            )
          ) : (
            <>
              <Text style={styles.infoText}>
                Täältä löydät lisäämäsi reseptit. Näyttää sille, että et ole
                vielä ehtinyt lisätä yhtään reseptiä.
              </Text>
              <Text style={styles.infoText}>
                Pääset lisäämään uusia reseptejä etusivulla "+"-painikkeen avulla. 
              </Text>
              <Image
            style={styles.image}
            source={require("../assets/addRecipe_advice.png")}
          />
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
  heading: {
    textAlign: "center",
    fontSize: 22,
    marginTop: 16,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  image:{
    alignSelf: 'center',
    width: 280,
    height: 45,
  },
});
