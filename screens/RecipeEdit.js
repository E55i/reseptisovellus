import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import GoBackAppBar from "../components/GoBackAppBar";
import { GetSingleRecipe } from "../components/GetRecipes";
import { Colors } from "../styles/Colors";
import ButtonWithIcon, {
  RoundButtonWithIcon,
  IconButton,
} from "../components/CustomButtons";
import {
  auth,
  firestore,
  doc,
  updateDoc,
  serverTimestamp,
  fbStorage,
  ref,
  deleteObject,
} from "../components/FirebaseConfig";

export default function RecipeEdit({ route, ...props }) {
  const recipeId = route.params.recipeId;
  const [loading, setLoading] = useState(true);
  const [recipeData, setRecipeData] = useState({});
  const [editTitle, setEditTitle] = useState(false);
  const [editIncredients, setEditIncredients] = useState(false);
  const [editInstructions, setEditInstructions] = useState(false);
  const [showIncredientInput, setShowIncredientInput] = useState(false);
  const [showInstructionInput, setShowInstructionInput] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const [newInstruction, setNewInstruction] = useState("");

  const navigation = useNavigation();

  // add new ingredient to recipe
  const addItem = (type) => {
    if (type === "incredient") {
      const newIngredients = [...recipeData.incredients, newIngredient];
      setRecipeData({ ...recipeData, incredients: newIngredients });
    } else if (type === "instruction") {
      const newInstructions = [...recipeData.instructions, newInstruction];
      setRecipeData({ ...recipeData, instructions: newInstructions });
    }
  };

  // increase instruction steps number by one
  const handleStepUp = () => {
    if (stepsNumber < tempSteps.length + 1) {
      setStepsNumber(stepsNumber + 1);
    }
  };

  // decrease instruction steps number by one
  const handleStepDown = () => {
    if (stepsNumber > 1) {
      setStepsNumber(stepsNumber - 1);
    }
  };

  // delete specific ingredient or instruction step
  const deleteItem = (index, type) => {
    if (type === "incredient") {
      const updatedIngredients = recipeData.incredients.filter(
        (item, i) => i !== index
      );
      setRecipeData({ ...recipeData, incredients: updatedIngredients });
    } else if (type === "instruction") {
      const updatedInstructions = recipeData.instructions.filter(
        (item, i) => i !== index
      );
      setRecipeData({ ...recipeData, instructions: updatedInstructions });
    }
  };

  const handlePhoto = (photo, photoName) => {
    setRecipeData({ ...recipeData, photo: photo, photoName: photoName });
  };

  const deletePhoto = () => {
    const photoName = recipeData.photoName;
    let imageRef = ref(fbStorage, photoName);
    console.log("imgRef: ", imageRef);

    // Delete the file
    deleteObject(imageRef)
      .then(() => {
        setRecipeData({ ...recipeData, photo: "", photoName: "" });
      })
      .catch((error) => {
        console.log(`Error deleting the photo: ${error}`);
        Alert.alert("Virhe poistettaessa kuvaa! Yritä myöhemmin uudelleen.");
      });
  };

  // update the recipeData to firestore
  const updateRecipeData = async () => {
    if (
      !recipeData.title ||
      !recipeData.incredients ||
      !recipeData.instructions ||
      !recipeData.servingSize ||
      !recipeData.prepTime ||
      !recipeData.cookTime
    ) {
      Alert.alert("Täytä kaikki pakolliset kentät.");
      return;

    } else {
      function removeUndefinedValues(obj) {
        Object.entries(obj).forEach(([key, value]) => {
          if (value === undefined) {
            delete obj[key];
          } else if (typeof value === 'object' && value !== null) {
            // Recursively check nested objects and arrays
            removeUndefinedValues(value);
          }
        });
      }

      removeUndefinedValues(recipeData);

      const docRef = await updateDoc(doc(firestore, "recipes", recipeId), {
        recipeData,
        lastEdit: serverTimestamp(),
      }).catch((error) => {
        console.log(error);
        ShowAlert("Error", error);
      });

      setRecipeData({});
      Alert.alert("Resepti tallennettu!");
      console.log("Data saved");
      navigation.goBack();
    }
  };

  // monitor changes in the form (remove from final app)

  useEffect(() => {
    console.log(recipeData);
  }, [recipeData]);

  return (
    <>
      <GoBackAppBar {...props} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <GetSingleRecipe
          recipeId={recipeId}
          setData={(data) => {
            setRecipeData(data);
            setLoading(false);
          }}
        />
        {loading ? (
          <ActivityIndicator
            size="large"
            animating={true}
            color={Colors.secondary}
          />
        ) : (
          <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
              {route.params?.photoUrl ? (
                <Image
                  style={styles.image}
                  source={{ uri: route.params.photoUrl }}
                  onLoad={() =>
                    handlePhoto(route.params.photoUrl, route.params.photoName)
                  }
                />
              ) : recipeData.photo !== "" ? (
                <Image
                  style={styles.image}
                  source={{ uri: recipeData.photo }}
                />
              ) : (
                <Image
                  style={styles.image}
                  source={require("../assets/image_placeholder.png")}
                />
              )}

              <View style={styles.imageButtons}>
                <RoundButtonWithIcon
                  icon="trash-sharp"
                  iconColor="#fff"
                  color={Colors.grey}
                  library="ionicons"
                  onPress={() => deletePhoto()}
                />
                <RoundButtonWithIcon
                  icon="camera"
                  iconColor="#fff"
                  color={Colors.primary}
                  onPress={() => {
                    navigation.navigate("PhotoScreen", {
                      calledFrom: "RecipeEdit",
                    });
                  }}
                />
              </View>
            </View>
            {editTitle ? (
              <View
                style={{
                  ...styles.section,
                  backgroundColor: "#e4e4e4",
                  borderRadius: 10,
                }}
              >
                <TextInput
                  style={styles.title}
                  value={recipeData.title}
                  multiline
                  autoCorrect={false}
                  onChangeText={(text) => {
                    setRecipeData({ ...recipeData, title: text });
                  }}
                />
                <View style={styles.editingButton}>
                  <IconButton
                    icon="checkcircle"
                    iconColor={Colors.secondary}
                    onPress={() => {
                      setEditTitle(!editTitle);
                    }}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.section}>
                <Text style={styles.title}>{recipeData.title}</Text>
                <View style={styles.editingButton}>
                  <IconButton
                    icon="setting"
                    iconColor={Colors.grey}
                    onPress={() => {
                      setEditTitle(!editTitle);
                    }}
                  />
                </View>
              </View>
            )}

            {editIncredients ? (
              <View
                style={{
                  ...styles.section,
                  backgroundColor: "#e4e4e4",
                  borderRadius: 10,
                  paddingTop: 36,
                }}
              >
                {recipeData.incredients.map((item, index) => (
                  <View key={`${index}-incredit`} style={styles.deleteItem}>
                    <IconButton
                      icon="closecircleo"
                      iconColor={Colors.grey}
                      onPress={() => {
                        deleteItem(index, "incredient");
                      }}
                    />
                    <TextInput
                      style={styles.incredientEdit}
                      value={item}
                      multiline
                      autoCorrect={false}
                      onChangeText={(text) => {
                        const updatedIncredients = [...recipeData.incredients];
                        updatedIncredients[index] = text;
                        setRecipeData({
                          ...recipeData,
                          incredients: updatedIncredients,
                        });
                      }}
                    />
                  </View>
                ))}
                <View style={styles.editingButton}>
                  <IconButton
                    icon="pluscircle"
                    iconColor={Colors.primary}
                    onPress={() => {
                      setShowIncredientInput(!showIncredientInput);
                    }}
                  />
                  <IconButton
                    icon="checkcircle"
                    iconColor={Colors.secondary}
                    onPress={() => {
                      setEditIncredients(!editIncredients);
                    }}
                  />
                </View>
                {showIncredientInput && (
                  <TextInput
                    placeholder="Lisää ainesosa ja määrä, esim. 400 g perunoita..."
                    style={styles.input}
                    value={newIngredient}
                    onChangeText={(text) => setNewIngredient(text)}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      addItem("incredient");
                      setShowIncredientInput(!showIncredientInput);
                      setNewIngredient("");
                    }}
                  />
                )}
              </View>
            ) : (
              <View style={styles.section}>
                {recipeData.incredients.map((item, index) => (
                  <Text key={`${index}-incr`} style={styles.incredient}>
                    {item}
                  </Text>
                ))}
                <View style={styles.editingButton}>
                  <IconButton
                    icon="setting"
                    iconColor={Colors.grey}
                    onPress={() => {
                      setEditIncredients(!editIncredients);
                    }}
                  />
                </View>
              </View>
            )}

            {editInstructions ? (
              <View
                style={{
                  ...styles.section,
                  backgroundColor: "#e4e4e4",
                  borderRadius: 10,
                  paddingTop: 36,
                }}
              >
                {recipeData.instructions.map((item, index) => (
                  <View
                    key={`${index}-instredit`}
                    style={styles.numberedInstruction}
                  >
                    <IconButton
                      icon="closecircleo"
                      iconColor={Colors.grey}
                      onPress={() => {
                        deleteItem(index, "instruction");
                      }}
                    />
                    <TextInput
                      style={styles.instruction}
                      value={item}
                      multiline
                      autoCorrect={false}
                      onChangeText={(text) => {
                        const updatedInstructions = [
                          ...recipeData.instructions,
                        ];
                        updatedInstructions[index] = text;
                        setRecipeData({
                          ...recipeData,
                          instructions: updatedInstructions,
                        });
                      }}
                    />
                  </View>
                ))}
                <View style={styles.editingButton}>
                  <IconButton
                    icon="pluscircle"
                    iconColor={Colors.primary}
                    onPress={() => {
                      setShowInstructionInput(!showInstructionInput);
                    }}
                  />
                  <IconButton
                    icon="checkcircle"
                    iconColor={Colors.secondary}
                    onPress={() => {
                      setEditInstructions(!editInstructions);
                    }}
                  />
                </View>
                {showInstructionInput && (
                  <TextInput
                    placeholder="Lisää työvaihe, esim. Keitä perunat..."
                    style={styles.input}
                    value={newInstruction}
                    onChangeText={(text) => setNewInstruction(text)}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      addItem("instruction");
                      setShowInstructionInput(!showInstructionInput);
                      setNewInstruction("");
                    }}
                  />
                )}
              </View>
            ) : (
              <View style={styles.section}>
                {recipeData.instructions.map((item, index) => (
                  <View
                    key={`${index}-instr`}
                    style={styles.numberedInstruction}
                  >
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                    <Text style={styles.instruction}>{item}</Text>
                  </View>
                ))}
                <View style={styles.editingButton}>
                  <IconButton
                    icon="setting"
                    iconColor={Colors.grey}
                    onPress={() => {
                      setEditInstructions(!editInstructions);
                    }}
                  />
                </View>
              </View>
            )}

            <View style={styles.sectionButtons}>
              <ButtonWithIcon
                icon={"back"}
                color={Colors.grey}
                width={140}
                title="Peruuta"
                onPress={() => {
                  setRecipeData({});
                  navigation.goBack();
                }}
              />
              <ButtonWithIcon
                icon={"arrowdown"}
                color={Colors.primary}
                width={140}
                title="Tallenna"
                onPress={() => {
                  updateRecipeData();
                }}
              />
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingBottom: 48,
  },
  imageContainer: {
    flex: 1,
  },
  imageButtons: {
    gap: 6,
    position: "absolute",
    bottom: 10,
    right: 16,
  },
  editingButton: {
    flexDirection: "row",
    position: "absolute",
    right: 4,
    top: 4,
  },
  image: {
    width: "100%",
    height: 250,
    alignSelf: "center",
  },
  section: {
    flex: 1,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    paddingRight: 20,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
  },
  incredient: {
    fontSize: 18,
    marginBottom: 4,
    marginLeft: 30,
  },
  incredientEdit: {
    fontSize: 18,
    marginBottom: 4,
    marginRight: 12,
  },
  deleteItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    height: 44,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    borderColor: Colors.secondary,
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
  numberedInstruction: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginRight: 30,
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
  },
  instruction: {
    fontSize: 18,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  sectionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 40,
    marginLeft: 12,
    marginRight: 12,
  },
});
