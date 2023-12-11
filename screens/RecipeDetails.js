import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  auth,
  firestore,
  collection,
  doc,
  addDoc,
  getDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  where,
} from "../components/FirebaseConfig";
import { getDatabase, ref, get } from "firebase/database";
import GoBackAppBar from "../components/GoBackAppBar";
import RatingBar from "../components/RatingBar";
import { useNavigation } from "@react-navigation/native";
import Rating from "../components/Rating";
import CommentBox from "../components/CommentBox";
import { Ionicons } from "@expo/vector-icons";
import ShowAlert from "../components/ShowAlert";
import { convertTimeStampToJS } from "../helpers/Functions";
import UpdateToPremium from "../components/UpdateToPremium";
import { Colors } from "../styles/Colors";

export default function RecipeDetails({ route }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [premiumRecipe, setPremiumRecipe] = useState("");
  const [isUserPremium, setIsUserPremium] = useState("0");
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [incredients, setIncredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [recipeRating, setRecipeRating] = useState(0);

  const { recipeId, backgroundColor } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const database = getDatabase();
    // Fetch user data
    const userRef = ref(database, "users/" + auth.currentUser.uid);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setIsUserPremium(userData.premium);
        }
      })
      .catch((error) => {
        ShowAlert("Virhe", "Tapahtui virhe käyttäjätietojen haussa.");
      });

    // Fetch recipes details from Firestore recipes collection
    const fetchRecipeData = async () => {
      try {
        const recipeDocSnapshot = await getDoc(
          doc(firestore, "recipes", recipeId)
        );

        if (recipeDocSnapshot.exists()) {
          const recipeData = recipeDocSnapshot.data();
          console.log("Recipe Data:", recipeData);
          setTitle(recipeData.recipeData.title);
          setPremiumRecipe(recipeData.recipeData.premium);
          setIncredients(recipeData.recipeData.incredients);
          setInstructions(recipeData.recipeData.instructions);
          setPhoto(recipeData.recipeData.photo);
          setRecipeRating(
            recipeData.recipeData.rating[0] / recipeData.recipeData.rating[1]
          );

          setIsLoading(false);
        } else {
          console.log("Reseptin tietoja ei löydy");
          navigation.navigate("Welcome");
          ShowAlert(
            "Hups!",
            "Nyt kävi hassusti. Tämän reseptin tietoja ei löytynyt. Kokeile jotain toista reseptiä."
          );
          setIsLoading(false);
        }
      } catch (error) {
        navigation.navigate("Welcome");
        ShowAlert(
          "Hups!",
          "Nyt kävi hassusti. Tämän reseptin tietoja ei löytynyt. Kokeile jotain toista reseptiä."
        );
        setIsLoading(false);
      }
    };

    // Fetch comments from Firestore feedbacks collection
    const fetchComments = async () => {
      try {
        onSnapshot(
          query(
            collection(firestore, "feedbacks"),
            where("recipeId", "==", recipeId),
            orderBy("created", "desc")
          ),
          (querySnapshot) => {
            const tempComments = [];
            querySnapshot.forEach((doc) => {
              const commentObject = {
                id: doc.id,
                comment: doc.data().comment,
                created: convertTimeStampToJS(doc.data().created),
                likes: doc.data().like,
                commentUserId: doc.data().userId,
              };
              tempComments.push(commentObject);
            });
            setComments(tempComments);
            setIsLoading(false);
          }
        );
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchRecipeData();
    fetchComments();
  }, []);

  // Save new comment to Firestore
  const saveComment = async () => {
    if (!newComment) {
      ShowAlert("", "Kirjoita kommenttiin teksitä ennen kuin lähetät sen");
      return;
    } else {
      const docRef = await addDoc(collection(firestore, "feedbacks"), {
        created: serverTimestamp(),
        recipeId: recipeId,
        userId: auth.currentUser.uid,
        comment: newComment,
        like: [],
      }).catch((error) => {
        ShowAlert(
          "Virhe",
          "Virhe kommentin lisäyksessä. Yritä myöhemmin uudelleen."
        );
      });
      setNewComment("");
    }
  };
  return (
    <View style={styles.firstContainer}>
      <GoBackAppBar backgroundColor={backgroundColor} navigation={navigation} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView>
          {/* Add an image component for the recipe here */}
          {isLoading && (
            <ActivityIndicator
              style={styles.activityIndicator}
              size="large"
              color="#47A73E"
            />
          )}
          {!isLoading && (
            <>
              {photo && (
                <Image style={styles.image} source={{ uri: photo }} />
              ) }
              <Text style={styles.title}>{title}</Text>
              <Rating rating={recipeRating} />
            </>
          )}

          {/*If it's not the case that the user is not premium but the recipe is premium, show the recipe details. 
          Otherwise tell the user that subscription must be upgraded to premium before recipe can be shown.*/}
          {(premiumRecipe !== "1" && isUserPremium !== "1") ||
          (premiumRecipe !== "1" && isUserPremium === "1") ||
          (premiumRecipe === "1" && isUserPremium === "1") ? (
            <>
              <View style={styles.section}>
                {incredients.map((item, index) => (
                  <Text key={index} style={styles.incredient}>
                    {item}
                  </Text>
                ))}
                <View style={styles.section}>
                  {instructions.map((item, index) => (
                    <View key={index} style={styles.numberedInstruction}>
                      <Text style={styles.stepNumber}>{index + 1}</Text>
                      <Text style={styles.instruction}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <RatingBar recipeId={recipeId} />
              {isLoading && (
                <ActivityIndicator
                  style={styles.activityIndicator}
                  size="large"
                  color="#47A73E"
                />
              )}
              {!isLoading &&
                comments.map((item) => (
                  <CommentBox
                    key={item.id}
                    commentId={item.id}
                    comment={item.comment}
                    created={item.created}
                    likes={item.likes}
                    commentUserId={item.commentUserId}
                  />
                ))}
              <View style={styles.newComment}>
                <TextInput
                  style={styles.input}
                  placeholder="Kirjoita kommentti..."
                  multiline={true}
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
                    saveComment();
                  }}
                >
                  <Ionicons name="send-sharp" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <UpdateToPremium />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  firstContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  title: {
    flex: 1,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    fontSize: 28,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
    alignSelf: "center",
    marginBottom: 16,
  },
  section: {
    flex: 1,
    margin: 20,
  },
  incredient: {
    fontSize: 18,
    marginBottom: 4,
    marginLeft: 30,
  },
  numberedInstruction: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  stepNumber: {
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    color: Colors.secondary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 8,
  },
  instruction: {
    fontSize: 18,
    marginBottom: 8,
    marginRight: 30,
    flexWrap: "wrap",
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
    height: "auto",
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
