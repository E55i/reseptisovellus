import React, { useEffect } from "react";
import {
  auth,
  firestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  doc,
  getDoc,
} from "../components/FirebaseConfig";
import { convertTimeStampToJS } from "../helpers/Functions";
import ShowAlert from "../components/ShowAlert";

export default function GetAllRecipes({ setData }) {
  useEffect(() => {
    const q = query(
      collection(firestore, "recipes"),
      orderBy("recipeData.title", "asc")
    );
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

      setData(tempRecipes);
    });
    return () => {
      unsubscribe();
    };
  }, []);
}

export function GetOwnRecipes({ setData, order, orderDirection = "asc" }) {
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
          premium: doc.data().recipeData.premium,
        };
        tempRecipes.push(recipeObject);
      });
      setData(tempRecipes);
    });
    return () => {
      unsubscribe();
    };
  }, []);
}

export function GetSingleRecipe({ recipeId, setData }) {
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const docRef = await getDoc(doc(firestore, "recipes", recipeId));

        if (docRef.exists()) {
          const data = docRef.data();
          const tempData = {
            id: doc.id,
            title: data.recipeData.title,
            created: convertTimeStampToJS(data.created),
            incredients: data.recipeData.incredients,
            instructions: data.recipeData.instructions,
            course: data.recipeData.course,
            mainIngredient: data.recipeData.mainIngredient,
            diet: data.recipeData.diet,
            source: data.recipeData.source,
            servingSize: data.recipeData.servingSize,
            prepTime: data.recipeData.prepTime,
            cookTime: data.recipeData.cookTime,
            caloriesKj: data.recipeData.caloriesKj,
            caloriesKcal: data.recipeData.caloriesKcal,
            totalFat: data.recipeData.totalFat,
            saturatedFat: data.recipeData.saturatedFat,
            totalCarb: data.recipeData.totalCarb,
            sugar: data.recipeData.sugar,
            protein: data.recipeData.protein,
            salt: data.recipeData.salt,
            photo: data.recipeData.photo,
            rating: data.recipeData.rating,
            healthyRating: data.recipeData.healthyRating,
            comments: data.recipeData.comments,
            premium: data.recipeData.premium,           
          };
          setData(tempData);
        } else {
          console.log("Reseptin tietoja ei löydy");
          ShowAlert(
            "Hups!",
            "Nyt kävi hassusti. Tämän reseptin tietoja ei löytynyt. Kokeile jotain toista reseptiä."
          );
        }
      } catch (error) {
        ShowAlert(
          "Hups!",
          "Nyt kävi hassusti. Tämän reseptin tietoja ei löytynyt. Kokeile jotain toista reseptiä."
        );
      }
    };
    fetchRecipeData();
  }, []);
}
