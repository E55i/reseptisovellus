import {
  View,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Button,
} from "react-native";
import {
  firestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "../components/FirebaseConfig";
import React, { useEffect, useState } from "react";
import DefaultAppBar from "../components/DefaultAppBar";
import Categories from "../components/Categories";
import RecipeCard from "../components/RecipeCard";
import ShowAlert from "../components/ShowAlert";


export default function WelcomeTest({ backgroundColor, navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [category, setCategory] = useState("");

  const handleClick = () => {
    try {
      if (isPremium) {
        setIsPremium(false);
      } else {
        setIsPremium(true);
      }
    } catch (error) {
      ShowAlert("Error", "Some error occurred");
    }
  };

  useEffect(() => {
    let q;
    if (category === "Jälkiruoka" || category === "Aamiainen") {
      q = query(
        collection(firestore, "recipes"),
        where("recipeData.course", "array-contains", category)
      );
    } else if (category === "Kanaruoat") {
      q = query(
        collection(firestore, "recipes"),
        where("recipeData.mainIngredient", "array-contains", "Broileri")
      );
    } else if (category === "Kasvisruoat") {
      q = query(
        collection(firestore, "recipes"),
        where("recipeData.diet", "array-contains", "Kasvis")
      );
    } else if (category === "Nopeat") {
      q = query(
        collection(firestore, "recipes"),
        where("recipeData.cookTime", "==", "alle 15 min"),
        where("recipeData.prepTime", "==", "alle 15 min")
      );
    } else {
      q = query(collection(firestore, "recipes"));
    }

    let unsubscribe;
    
    try {
     unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempRecipes = [];
      querySnapshot.forEach((doc) => {
        const recipeObject = {
          id: doc.id,
          title: doc.data().recipeData.title,
          servingSize: doc.data().recipeData.servingSize,
          cookTime: doc.data().recipeData.cookTime,
          prepTime: doc.data().recipeData.prepTime,
          photo: doc.data().recipeData.photo,
        };
        tempRecipes.push(recipeObject);
      });
      setRecipes(tempRecipes);
      setIsLoading(false);
    });
  } catch (error) {
    setIsLoading(false);
    ShowAlert("Virhe","Reseptien hakemisessa ilmeni virhe. Yritä myöhemmin uudelleen.");      
  }
    return () => {
      unsubscribe();
    };
  }, [category]);

  console.log(recipes);
  return (
    <View style={styles.container}>
      <DefaultAppBar
        backgroundColor={backgroundColor}
        navigation={navigation}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>Tervetuloa Essi</Text>
        <Button title="Premium" onPress={() => handleClick()} />
        <Text style={styles.infoText}>Mitä haluaisit kokata tänään?</Text>
        <Categories setCategory={setCategory} />
        {!isPremium && (
          <Image
            style={styles.add}
            source={require("../assets/mainos_vaaka.png")}
          />
        )}
        {category === "" && (
          <Text style={styles.textFavourites}>Suosituimmat reseptit</Text>
        )}
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
    marginTop: 16,
    marginBottom: 16,
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
