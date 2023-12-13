import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import React, { useState, useEffect } from "react";
import {
  auth,
  firestore,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "./FirebaseConfig";
import ShowAlert from "./ShowAlert";

export default function RatingBar({ recipeId }) {
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const ratingScale = [1, 2, 3, 4, 5];

  useEffect(() => {
    const recipesCollection = collection(firestore, "recipes");
    const specificRecipeDoc = doc(recipesCollection, recipeId);

    const getRecipesRatingInfo = async () => {
      try {
        const recipeSnapshot = await getDoc(specificRecipeDoc);
        // fetch the documet data
        const recipeData = recipeSnapshot.data();

        //check if curren user has already rated this recipe
        if (
          recipeData.recipeData.userRated &&
          recipeData.recipeData.userRated.includes(auth.currentUser.uid)
        ) {
          setIsRated(true);
        }
      } catch (error) {
        ShowAlert(
          "Virhe",
          "Reseptin tietojen haussa ilmeni virhe. Kokeile myöhemmin uudelleen."
        );
      }
    };
    getRecipesRatingInfo();
  }, []);

  // save rating to database
  const saveRating = async (value) => {
    try {
      // Get reference to Firestore database
      const recipesCollection = collection(firestore, "recipes");
      //specific the recipe document
      const recipeDoc = doc(recipesCollection, recipeId);

      // Get the current data of the recipe document
      const recipeSnapshot = await getDoc(recipeDoc);
      const currentData = recipeSnapshot.data();

      // Update the rating array
      const currentRating =
        currentData.recipeData && Array.isArray(currentData.recipeData.rating)
          ? currentData.recipeData.rating
          : [];
          currentRating[0] = currentRating[0] ? currentRating[0] + value : value;
          currentRating[1] = currentRating[1] ? currentRating[1] + 1 : 1;

      const currentUserRated =
        currentData.recipeData &&
        Array.isArray(currentData.recipeData.userRated)
          ? currentData.recipeData.userRated
          : [];
      currentUserRated.push(auth.currentUser.uid);

      // Save updated document back to Firestore
      await updateDoc(recipeDoc, {
        "recipeData.rating": currentRating,
        "recipeData.userRated": currentUserRated,
      });

      // Tell user that rating is saved
      ShowAlert("", "Kiitos että arvioit reseptin!");
    } catch (error) {
      //Tell user if there is an error saving the rating
      ShowAlert(
        "Virhe",
        "Antamaasi arviota ei voitu tallentaa. Yritä myöhemmin uudelleen."
      );
    }
  };

  return (
    <>
      {!isRated && (
        <View>
          <View style={styles.ratingBar}>
            {ratingScale.map((item) => {
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setRating(item);
                  }}
                >
                  <Image
                    style={styles.starImage}
                    source={
                      item <= rating
                        ? require("../assets/star_filled.png")
                        : require("../assets/star_corner.png")
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: rating === 0 ? "#8B8B8B" : "#47A73E" },
            ]}
            disabled={rating === 0}
            onPress={() => {
              saveRating(rating);
              setIsRated(true);
            }}
          >
            <Text style={styles.buttonText}>
              {rating === 0 ? "Ei arvioitu" : `Tallenna arvio ${rating}/5`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  ratingBar: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 16,
  },
  starImage: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
  },
});
