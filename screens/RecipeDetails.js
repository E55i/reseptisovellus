import React, { useState, useEffect, useRef } from "react";
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
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  where,
} from "../components/FirebaseConfig";
import { getDatabase, ref, get } from "firebase/database";
import GoBackAppBar from "../components/GoBackAppBar";
import RatingBar from "../components/RatingBar";
import Rating from "../components/Rating";
import CommentBox from "../components/CommentBox";
import { Ionicons } from "@expo/vector-icons";
import ShowAlert from "../components/ShowAlert";
import { convertTimeStampToJS } from "../helpers/Functions";
import UpdateToPremium from "../components/UpdateToPremium";
import { Colors } from "../styles/Colors";
import { GetSingleRecipe } from "../components/GetRecipes";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function RecipeDetails({ route, ...props }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserPremium, setIsUserPremium] = useState("0");

  const scrollViewRef = useRef();
  let { recipeId } = route.params;

  useEffect(() => {
    // if page is scrolled down before, it is automatically scrolled to the top of the page when searching new recipe
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
    let isMounted = true; // Flag to track whether the component is mounted
    const fetchData = async () => {
      try {
        // Fetch user data
        const database = getDatabase();
        const userRef = ref(database, "users/" + auth.currentUser.uid);
        const userSnapshot = await get(userRef);
        if (isMounted && userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setIsUserPremium(userData.premium);
        }

        // Fetch the recipe data
        const recipe = await GetSingleRecipe({ recipeId });
        if (isMounted) {
          setData(recipe);
        }
        // Fetch comments from Firestore feedbacks collection
        const unsubscribe = onSnapshot(
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
            if (isMounted) {
              setComments(tempComments);
              setIsLoading(false);
            }
          }
        );

        // Cleanup: Unsubscribe from real-time updates when the component is unmounted
        return () => {
          isMounted = false;
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // Cleanup: Ensure that any asynchronous tasks or subscriptions are cleared
    // when the component is unmounted
    return () => {
      isMounted = false;
    };
  }, [recipeId]);

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
    <>
      <GoBackAppBar {...props} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView style={styles.scrollContainer} ref={scrollViewRef}>
          {isLoading ? (
            <ActivityIndicator
              style={styles.activityIndicator}
              size="large"
              color={Colors.secondary}
            />
          ) : (
            <>
              <Image style={styles.image} source={{ uri: data.photo }} />
              <Text style={styles.title}>{data.title}</Text>
              <View style={{ ...styles.section, alignItems: "center" }}>
                <View style={styles.iconTextRow}>
                  <MaterialCommunityIcons
                    name="account-group"
                    size={20}
                    color={Colors.grey}
                  />
                  <Text style={styles.infoText}>
                    Annoskoko: {data.servingSize} hlö
                  </Text>
                </View>
                <View style={styles.iconTextRow}>
                  <Feather name="clock" size={20} color={Colors.grey} />
                  <Text style={styles.infoText}>
                    Valmisteluaika: {data.prepTime}
                  </Text>
                </View>

                <View style={styles.iconTextRow}>
                  <MaterialCommunityIcons
                    style={styles.icon}
                    name="toaster-oven"
                    size={20}
                    color={Colors.grey}
                  />
                  <Text style={styles.infoText}>
                    Kokkausaika: {data.cookTime}
                  </Text>
                </View>
              </View>
              <View style={styles.section}>
                <Rating rating={data.rating[0] / data.rating[1]} />
              </View>
              {/*Check if recipe is premium but user is not premium. 
              If true, don't show incredients, instructions or commnets but show window where user can update subscription to premium */}
              {data.premium === "1" && isUserPremium !== "1" ? (
                <UpdateToPremium />
              ) : (
                <>
                  <View style={styles.section}>
                    {data.incredients.map((item, index) => (
                      <Text key={`${index}-incr`} style={styles.incredient}>
                        {item}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.section}>
                    {data.instructions.map((item, index) => (
                      <View
                        key={`${index}-instr`}
                        style={styles.numberedInstruction}
                      >
                        <Text style={styles.stepNumber}>{index + 1}</Text>
                        <Text style={styles.instruction}>{item}</Text>
                      </View>
                    ))}
                  </View>
                  <RatingBar recipeId={recipeId} />
                  {comments.map((item) => (
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
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  title: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 250,
    alignSelf: "center",
    marginBottom: 16,
  },
  section: {
    flex: 1,
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16,
  },
  iconTextRow: {
    flexDirection: "row",
  },
  infoText: {
    fontSize: 16,
    paddingLeft: 8,
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
    marginBottom: 40,
  },

  input: {
    flex: 6,
    minHeight: 50,
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
