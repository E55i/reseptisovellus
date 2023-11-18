import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import DefaultAppBar from "../components/DefaultAppBar";
import Categories from "../components/Categories";
import RecipeCard from "../components/RecipeCard";
import { getDocs } from 'firebase/firestore';
import {
  firestore,
  collection
} from "../components/FirebaseConfig";
import ShowAlert from "../components/ShowAlert";

//Hae käyttäjän nimi tietokannasta
//Hae suosituimmat reseptit

export default function Welcome({ ...props }) {
  const [recipes, setRecipes] = useState([]);
  const [tempRecipes, setTempRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "recipes"));
        const recipeObject =  querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().recipeData.title,
          servingSize: doc.data().recipeData.servingSize,
          cookTime: doc.data().recipeData.cookTime,
          photo: doc.data().recipeData.photo,
        }));

        setRecipes(recipeObject);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        ShowAlert("Virhe","Jotain meni pieleen. Kokeile myöhemmin uudelleen.");
      }
    };

    fetchRecipes();
  }, [setRecipes]);

  return (
    <View style={styles.container}>
      <DefaultAppBar {...props} />
      <Text style={styles.welcomeText}>Tervetuloa Essi</Text>
      <Text style={styles.infoText}>Mitä haluaisit kokata tänään?</Text>
      <Categories />
      <Text>Mainos jos kyseessä maksuton käyttäjä</Text>
      <Text style={styles.textFavourites}>Suosituimmat reseptit</Text>
      {isLoading && (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="large"
          color="#47A73E"
        />
      )}
      {isLoading === false && (
        <RecipeCard
          recipeId={recipes[0].id}
          urlToImage = {recipes[0].photo}
          recipeName={recipes[0].title}
          cookTime={recipes[0].cookTime}
          servingSize={recipes[0].servingSize}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  textFavourites:{
    marginTop: 8,
    marginBottom: 8,
    fontSize: 20,
    color: "#8B8B8B",
    textAlign: "center",
  },
});
