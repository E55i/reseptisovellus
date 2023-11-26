import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  auth,
  firestore,
  collection,
  addDoc,
  serverTimestamp,
} from "../components/FirebaseConfig";
import GoBackAppBar from "../components/GoBackAppBar";
import RatingBar from "../components/RatingBar";
import { useNavigation } from "@react-navigation/native";
import Rating from "../components/Rating";
import CommentBox from "../components/CommentBox";
import { Ionicons } from "@expo/vector-icons";
import ShowAlert from "../components/ShowAlert";

export default function RecipeDetails({ route }) {
  const [newComment, setNewComment] = useState("");
  const { recipeId, backgroundColor } = route.params;
  const navigation = useNavigation();
 
  const saveComment = async () => {
    if (!newComment) {
      ShowAlert("","Kirjoita kommenttiin teksitä ennen kuin lähetät sen");
      return;
    } else {
      const docRef = await addDoc(collection(firestore, "feedbacks"), {
        created: serverTimestamp(),
        recipeId: recipeId,
        userId: auth.currentUser.uid,
        comment: newComment,
        like: "",
      }).catch((error) => {
        console.log(error);
        ShowAlert("Virhe","Virhe kommentin lisäyksessä. Yritä myöhemmin uudelleen.")
      });
      console.log("Kommentti lisätty");
      setNewComment("");
    }
  };
  return (
    <View style={styles.container}>
      <GoBackAppBar backgroundColor={backgroundColor} navigation={navigation} />

      <ScrollView>
        <Text>Tämä on recipeId: {recipeId}</Text>
        {/*Tähän tulee tietokannasta haettu rating, 
        nyt näön vuoksi laitettu jokin arvosana, jotta komponentti näkyy näytöllä*/}
        <Rating rating={3.2} />
        {/* Add an image component for the recipe here */}
        <Text>Ingredients:</Text>
        <Text>Ingredient 1, Ingredient 2, ...</Text>
        <Text>Instructions:</Text>
        <Text>Step-by-step instructions go here...</Text>
        <RatingBar recipeId={recipeId} />
        <Text>Comments:</Text>
        <CommentBox />
        {/* List comments here */}
        <View style={styles.newComment}>
          <TextInput
            style={styles.input}
            placeholder="Kirjoita kommentti..."
            value={newComment}
            returnKeyType="send"
            onSubmitEditing={() => {
              if (newComment !== "") {
                saveComment(newComment);
              }
            }}
            onChangeText={(text) => setNewComment(text)}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
                saveComment()
            }}
          >
            <Ionicons name="send-sharp" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  newComment: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 16,
  },
  input: {
    flex: 6,
    height: 44,
    marginRight: 8,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    borderColor: "#47A73E",
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
  sendButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#FF9C00",
    borderRadius: 50,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
