import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import DefaultAppBar from "../components/DefaultAppBar";
import ButtonWithIcon from "../components/CustomButtons";
import { Colors } from "../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import {
  auth,
  firestore,
  collection,
  addDoc,
  serverTimestamp,
} from "../components/FirebaseConfig";

export default function AddRecipe({ ...props }) {
  const [recipeData, setRecipeData] = useState({
    userId: auth.currentUser.uid,
    title: "",
    incredients: "",
    instructions: "",
    course: "",
    mainIngredient: "",
    diet: "",
    source: "",
    servingSize: "",
    prepTime: "",
    cookTime: "",
    caloriesKj: "",
    caloriesKcal: "",
    totalFat: "",
    saturatedFat: "",
    totalCarb: "",
    sugar: "",
    protein: "",
    salt: "",
    photo: "",
    rating: 0,
    healthyRating: 0,
    comments: "",
  });

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedMainIngredients, setSelectedMainIngredients] = useState([]);
  const [selectedDiets, setSelectedDiets] = useState([]);

  const timeOptions = [
    { key: "1", value: "alle 15 min" },
    { key: "2", value: "alle 30 min" },
    { key: "3", value: "30-60 min" },
    { key: "4", value: "yli 60 min" },
  ];

  const courseOptions = [
    { key: "1", value: "Aamiainen" },
    { key: "2", value: "Alkupala" },
    { key: "3", value: "Pääruoka" },
    { key: "4", value: "Jälkiruoka" },
    { key: "5", value: "Salaatti" },
    { key: "6", value: "Keitto" },
    { key: "7", value: "Lisuke" },
    { key: "8", value: "Juoma" },
  ];

  const mainIngredientOptions = [
    { key: "1", value: "Nauta" },
    { key: "2", value: "Sika" },
    { key: "3", value: "Makkara" },
    { key: "4", value: "Broileri" },
    { key: "5", value: "Kala" },
    { key: "6", value: "Äyriäiset" },
    { key: "7", value: "Kananmuna" },
    { key: "8", value: "Kasviproteiini" },
  ];

  const dietOptions = [
    { key: "1", value: "Kasvis" },
    { key: "2", value: "Vegaaninen" },
    { key: "3", value: "Gluteeniton" },
    { key: "4", value: "Laktoositon" },
    { key: "5", value: "Maidoton" },
    { key: "6", value: "Kananmunaton" },
    { key: "7", value: "Vähähiilihydraattinen" },
  ];

  const handleCourseSelect = () => {
    setRecipeData({ ...recipeData, course: selectedCourses });
  };

  const handleMainIngredientSelect = () => {
    setRecipeData({ ...recipeData, mainIngredient: selectedMainIngredients });
  };

  const handleDietSelect = () => {
    setRecipeData({ ...recipeData, diet: selectedDiets });
  };

  // navigate to main screen after after save
  const navigation = useNavigation();

  // save the recipeData
  const save = async () => {
    const docRef = await addDoc(collection(firestore, "recipes"), {
      recipeData,
      created: serverTimestamp(),
    }).catch((error) => console.log(error)); // TODO: error handling!
    setRecipeData({});
    Alert.alert("Resepti tallennettu!");
    console.log("Data saved");
  };

  // monitor changes in the form (remove from final app)
  useEffect(() => {
    console.log(recipeData);
  }, [recipeData]);

  return (
    <>
      <DefaultAppBar {...props} />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.sectionTitle}>
            <Text style={{ fontSize: 28 }}>Lisää resepti</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Reseptin nimi</Text>
            <TextInput
              style={styles.input}
              placeholder="Reseptin nimi"
              onChangeText={(text) =>
                setRecipeData({ ...recipeData, title: text })
              }
            ></TextInput>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Ainekset</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Lisää ainekset"
              multiline
              onChangeText={(text) =>
                setRecipeData({ ...recipeData, incredients: text })
              }
            ></TextInput>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Ohjeet</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Lisää ohjeet"
              multiline
              onChangeText={(text) =>
                setRecipeData({ ...recipeData, instructions: text })
              }
            ></TextInput>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Lähde</Text>
            <TextInput
              style={styles.input}
              placeholder="Kirjan nimi, internet-sivusto, tms..."
              onChangeText={(text) =>
                setRecipeData({ ...recipeData, source: text })
              }
            ></TextInput>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Annoskoko</Text>
            <TextInput
              style={styles.input}
              placeholder="Henkilömäärä"
              keyboardType="numeric"
              onChangeText={(text) =>
                setRecipeData({ ...recipeData, servingSize: text })
              }
            ></TextInput>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Valmisteluaika</Text>
            <SelectList
              boxStyles={styles.input}
              placeholder="Valitse"
              setSelected={(val) =>
                setRecipeData({ ...recipeData, prepTime: val })
              }
              data={timeOptions}
              search={false}
              save="value"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Kokkausaika</Text>
            <SelectList
              boxStyles={styles.input}
              placeholder="Valitse"
              setSelected={(val) =>
                setRecipeData({ ...recipeData, cookTime: val })
              }
              data={timeOptions}
              search={false}
              save="value"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Ruokalaji</Text>
            <MultipleSelectList
              boxStyles={[styles.input, { height: null }]}
              placeholder="Valitse"
              badgeStyles={{ backgroundColor: Colors.secondary }}
              setSelected={(val) => setSelectedCourses(val)}
              data={courseOptions}
              search={false}
              save="value"
              onSelect={handleCourseSelect}
              label="Omat valinnat"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Pääraaka-aine</Text>
            <MultipleSelectList
              boxStyles={[styles.input, { height: null }]}
              placeholder="Valitse"
              badgeStyles={{ backgroundColor: Colors.secondary }}
              setSelected={(val) => setSelectedMainIngredients(val)}
              data={mainIngredientOptions}
              search={false}
              save="value"
              onSelect={handleMainIngredientSelect}
              label="Omat valinnat"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Ruokavalio</Text>
            <MultipleSelectList
              boxStyles={[styles.input, { height: null }]}
              placeholder="Valitse"
              badgeStyles={{ backgroundColor: Colors.secondary }}
              setSelected={(val) => setSelectedDiets(val)}
              data={dietOptions}
              search={false}
              save="value"
              onSelect={handleDietSelect}
              label="Omat valinnat"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Ravintosisältö</Text>

            <View style={styles.row}>
              <Text style={{ fontSize: 16 }}>Energia</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TextInput
                  style={[styles.input, styles.caloriesInput]}
                  placeholder="kJ"
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setRecipeData({ ...recipeData, caloriesKj: text })
                  }
                ></TextInput>
                <TextInput
                  style={[styles.input, styles.caloriesInput]}
                  placeholder="kcal"
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setRecipeData({ ...recipeData, caloriesKcal: text })
                  }
                ></TextInput>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={{ fontSize: 16 }}>Rasva</Text>
              <TextInput
                style={[styles.input, styles.rowInput]}
                placeholder="Gramaa (g)"
                keyboardType="numeric"
                onChangeText={(text) =>
                  setRecipeData({ ...recipeData, totalFat: text })
                }
              ></TextInput>
            </View>

            <View style={styles.row}>
              <Text style={{ fontSize: 16, marginLeft: 16 }}>
                josta tyydyttynyttä
              </Text>
              <TextInput
                style={[styles.input, styles.rowInput]}
                placeholder="Gramaa (g)"
                keyboardType="numeric"
                onChangeText={(text) =>
                  setRecipeData({ ...recipeData, saturatedFat: text })
                }
              ></TextInput>
            </View>

            <View style={styles.row}>
              <Text style={{ fontSize: 16 }}>Hiilihydraatit</Text>
              <TextInput
                style={[styles.input, styles.rowInput]}
                placeholder="Gramaa (g)"
                keyboardType="numeric"
                onChangeText={(text) =>
                  setRecipeData({ ...recipeData, totalCarb: text })
                }
              ></TextInput>
            </View>

            <View style={styles.row}>
              <Text style={{ fontSize: 16, marginLeft: 16 }}>
                josta sokereita
              </Text>
              <TextInput
                style={[styles.input, styles.rowInput]}
                placeholder="Gramaa (g)"
                keyboardType="numeric"
                onChangeText={(text) =>
                  setRecipeData({ ...recipeData, sugar: text })
                }
              ></TextInput>
            </View>

            <View style={styles.row}>
              <Text style={{ fontSize: 16 }}>Proteiini</Text>
              <TextInput
                style={[styles.input, styles.rowInput]}
                placeholder="Gramaa (g)"
                keyboardType="numeric"
                onChangeText={(text) =>
                  setRecipeData({ ...recipeData, protein: text })
                }
              ></TextInput>
            </View>

            <View style={styles.row}>
              <Text style={{ fontSize: 16 }}>Suola</Text>
              <TextInput
                style={[styles.input, styles.rowInput]}
                placeholder="Gramaa (g)"
                keyboardType="numeric"
                onChangeText={(text) =>
                  setRecipeData({ ...recipeData, salt: text })
                }
              ></TextInput>
            </View>
          </View>

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
              color={Colors.secondary}
              width={140}
              title="Tallenna"
              onPress={() => {
                save();
                setRecipeData({});
                navigation.goBack();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  sectionTitle: {
    flex: 1,
    height: 72,
    marginTop: 20,
    fontSize: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    flex: 1,
    marginBottom: 20,
    marginLeft: 12,
    marginRight: 12,
  },
  header: {
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 44,
    marginLeft: 12,
    marginRight: 12,
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
  multilineInput: {
    paddingTop: 8,
    minHeight: 100,
    marginBottom: 60,
    textAlignVertical: "top",
  },
  caloriesInput: {
    width: 80,
    marginLeft: 0,
    marginRight: 0,
  },
  rowInput: {
    width: 168,
    marginLeft: 0,
    marginRight: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    marginLeft: 12,
    marginRight: 12,
  },
  sectionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
    gap: 8,
  },
});
