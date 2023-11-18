import React, { useEffect } from "react";
import {
  auth,
  firestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "../components/FirebaseConfig";
import { convertTimeStampToJS } from "../helpers/Functions";

export default function GetOwnRecipes({
  setData,
  order,
  orderDirection = "asc",
}) {
  useEffect(() => {
    const q = query(
      collection(firestore, "recipes"),
      where("recipeData.userId", "==", auth.currentUser.uid),
      orderBy(order, orderDirection)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempRecipes = [];
      querySnapshot.forEach((doc) => {
        const recipeObject = {
          id: doc.id,
          title: doc.data().recipeData.title,
          created: convertTimeStampToJS(doc.data().created),
          incredients: doc.data().recipeData.incredients,
          instructions: doc.data().recipeData.instructions,
          course: doc.data().recipeData.course,
          mainIngredient: doc.data().recipeData.mainIngredient,
          diet: doc.data().recipeData.diet,
          source: doc.data().recipeData.source,
          servingSize: doc.data().recipeData.servingSize,
          prepTime: doc.data().recipeData.prepTime,
          cookTime: doc.data().recipeData.cookTime,
          caloriesKj: doc.data().recipeData.caloriesKj,
          caloriesKcal: doc.data().recipeData.caloriesKcal,
          totalFat: doc.data().recipeData.totalFat,
          saturatedFat: doc.data().recipeData.saturatedFat,
          totalCarb: doc.data().recipeData.totalCarb,
          sugar: doc.data().recipeData.sugar,
          protein: doc.data().recipeData.protein,
          salt: doc.data().recipeData.salt,
          photo: doc.data().recipeData.photo,
          rating: doc.data().recipeData.rating,
          healthyRating: doc.data().recipeData.healthyRating,
          comments: doc.data().recipeData.comments,
        };
        tempRecipes.push(recipeObject);
      });
      setData(tempRecipes);
    });
    return () => {
      unsubscribe();
    };
  }, [setData, order, orderDirection]);
}
