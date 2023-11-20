import {
  View,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import DefaultAppBar from "../components/DefaultAppBar";
import Categories from "../components/Categories";
import RecipeCard from "../components/RecipeCard";
import { getDocs } from "firebase/firestore";
import { firestore, collection } from "../components/FirebaseConfig";
import ShowAlert from "../components/ShowAlert";

export default function WelcomeTest({ backgroundColor, navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "recipes"));
        const recipeObject = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().recipeData.title,
          servingSize: doc.data().recipeData.servingSize,
          cookTime: doc.data().recipeData.cookTime,
          prepTime: doc.data().recipeData.prepTime,
          photo: doc.data().recipeData.photo,
        }));

        setRecipes(recipeObject);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        ShowAlert("Virhe", "Jotain meni pieleen. Kokeile myöhemmin uudelleen.");
      }
    })();
  }, []);

  console.log(recipes);
  return (
    <View style={styles.container}>
      <DefaultAppBar
        backgroundColor={backgroundColor}
        navigation={navigation}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>Tervetuloa Essi</Text>
        <Text style={styles.infoText}>Mitä haluaisit kokata tänään?</Text>
        <Categories />
        {!isPremium && (
          <Image
            style={styles.add}
            source={require("../assets/mainos_vaaka.png")}
          />
        )}
        <Text style={styles.textFavourites}>Suosituimmat reseptit</Text>
        {isLoading && (
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
            color="#47A73E"
          />
        )}
        {!isLoading &&
          recipes.map((item) => (
            <RecipeCard
              key={item.id}
              recipeId={item.id}
              prepTime={item.prepTime}
              urlToImage={item.photo}
              recipeName={item.title}
              cookTime={item.cookTime}
              servingSize={item.servingSize}
              backgroundColor={backgroundColor}
            />
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  add: {
    width: 350,
    height: 100,
    alignSelf: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 36,
    marginLeft: 2,
  },
  container: {
    backgroundColor: "white",
  },
  welcomeText: {
    marginLeft: 8,
    marginTop: 20,
    marginBottom: 16,
    fontSize: 16,
    textAlign: "center",
  },
  infoText: {
    marginTop: 8,
    marginBottom: 26,
    fontSize: 20,
    color: "#8B8B8B",
    textAlign: "center",
  },
  textFavourites: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 20,
    color: "#8B8B8B",
    textAlign: "center",
  },
});
