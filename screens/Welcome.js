import {
  View,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
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
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

export default function WelcomeTest({ backgroundColor, navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState("0");
  const [category, setCategory] = useState("");
  const [userName, setUserName] = useState("");

  // Fetch user data and top recipes when component is shown first time
  useEffect(() => {
    const auth = getAuth();
    const database = getDatabase();
    const user = auth.currentUser;
    if (user) {
      // Fetch user data
      const userRef = ref(database, "users/" + user.uid);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserName(userData.firstName); 
            setIsPremium(userData.premium); 
          }
        })
        .catch((error) => {
          ShowAlert("Virhe", "Tapahtui virhe käyttäjätietojen haussa.");
          console.error("Error fetching user data:", error);
        });
    }

    // Fetch top recipes
    try {
      onSnapshot(query(collection(firestore, "recipes")), (querySnapshot) => {
        const tempRecipes = [];
        querySnapshot.forEach((doc) => {
          const recipeObject = {
            id: doc.id,
            title: doc.data().recipeData.title,
            servingSize: doc.data().recipeData.servingSize,
            cookTime: doc.data().recipeData.cookTime,
            prepTime: doc.data().recipeData.prepTime,
            photo: doc.data().recipeData.photo,
            //recipeRating is the average of the given ratings
            recipeRating: doc.data().recipeData.rating[1]
              ? doc.data().recipeData.rating[0] /
                doc.data().recipeData.rating[1]
              : 0,
          };
          tempRecipes.push(recipeObject);
        });
        tempRecipes.sort((a, b) => b.recipeRating - a.recipeRating);
        setRecipes(tempRecipes);
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      ShowAlert(
        "Virhe",
        "Reseptien hakemisessa ilmeni virhe. Yritä myöhemmin uudelleen."
      );
    }
  }, []);

  // Fetch recipes based on category change
  useEffect(() => {
    (() => {
      try {
        let q;
        if (category === "Jälkiruoka" || category === "Aamiainen") {
          q = query(
            collection(firestore, "recipes"),
            where("recipeData.course", "array-contains", category),
            orderBy("created", "desc")
          );
        } else if (category === "Kanaruoat") {
          q = query(
            collection(firestore, "recipes"),
            where("recipeData.mainIngredient", "array-contains", "Broileri"),
            orderBy("created", "desc")
          );
        } else if (category === "Kasvisruoat") {
          q = query(
            collection(firestore, "recipes"),
            where("recipeData.diet", "array-contains", "Kasvis"),
            orderBy("created", "desc")
          );
        } else if (category === "Nopeat") {
          q = query(
            collection(firestore, "recipes"),
            where("recipeData.cookTime", "==", "alle 15 min"),
            where("recipeData.prepTime", "==", "alle 15 min"),
            orderBy("created", "desc")
          );
        }
        onSnapshot(q, (querySnapshot) => {
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
        console.log("Virhe kategorioiden haussa: " + error);
      }
    })();
  }, [category]);

  console.log(recipes);
  return (
    <View style={styles.container}>
      {/* show appbar top of the screen */}
      <DefaultAppBar
        backgroundColor={backgroundColor}
        navigation={navigation}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>
          {userName ? `Tervetuloa ${userName}` : "Tervetuloa"}
        </Text>
        <Text style={styles.infoText}>Mitä haluaisit kokata tänään?</Text>
        {/* Categories component */}
        <Categories setCategory={setCategory} />
        {/* Show add if user is not premium */}
        {isPremium === "0" && (
          <Image
            style={styles.add}
            source={require("../assets/mainos_vaaka.png")}
          />
        )}
         {/* Show text if no category selected */}
        {category === "" && (
          <Text style={styles.textFavourites}>
            Top 10 suosituimmat reseptit
          </Text>
        )}
        {/* Show loading indicator when data is not fetch */}
        {isLoading && (
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
            color="#47A73E"
          />
        )}
         {/* Show top 10 recipes when category is not choosed*/}
        {!isLoading &&
          category === "" &&
          recipes
            .slice(0, 10)
            .map((item) => (
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
             {/* If category is selected show recipes based on the category */}
        {!isLoading &&
          category !== "" &&
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
    paddingBottom: 60,
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
