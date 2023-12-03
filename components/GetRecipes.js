import React, { useEffect } from "react";
import {
  firestore,
  collection,
  query,
  onSnapshot,
} from "../components/FirebaseConfig";
import { convertTimeStampToJS } from "../helpers/Functions";

export default function GetRecipes({ setData }) {
  useEffect(() => {
    const q = query(collection(firestore, "recipes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempRecipes = [];
      querySnapshot.forEach((doc) => {
        const recipeObject = {
          id: doc.id,
          userId: doc.data().recipeData.userId,
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
        };
        tempRecipes.push(recipeObject);
      });

      // sort the recipes according to title
      tempRecipes.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
      });

      setData(tempRecipes);
    });
    return () => {
      unsubscribe();
    };
  }, [setData]);
}