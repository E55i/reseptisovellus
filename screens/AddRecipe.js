import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import DefaultAppBar from "../components/DefaultAppBar";
import ButtonWithIcon from "../components/CustomButtons";
import { Colors } from "../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import CustomCheckBox from "../components/CustomCheckBox";
import { auth } from "../components/FirebaseConfig";

export default function AddRecipe({ ...props }) {
  const [recipeData, setRecipeData] = useState({
    userId: auth.currentUser.uid,
    title: "",
    incredients: "",
    instructions: "",
    course: "", // aamiainen/välipala...
    mainIngredient: "",
    diet: "",
    source: "", // kirjan nimi/nettisivu...
    servingSize: "", // annoskoko
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
    rating: "",
    comments: "",
  });

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedMainIngredients, setSelectedMainIngredients] = useState([]);
  const [selectedDiets, setSelectedDiets] = useState([]);

  const courseOptions = [
    "Aamiainen",
    "Alkupala",
    "Pääruoka",
    "Jälkiruoka",
    "Salaatti",
    "Keitto",
    "Lisuke",
    "Juoma",
  ];

  const mainIngredientOptions = [
    "Nauta",
    "Sika",
    "Makkara",
    "Broileri",
    "Kala",
    "Äyriäiset",
    "Kananmuna",
    "Kasviproteiini",
  ];

  const dietOptions = [
    "Kasvis",
    "Vegaaninen",
    "Gluteeniton",
    "Laktoositon",
    "Maidoton",
    "Kananmunaton",
    "Vähähiilihydraattinen",
  ];

  const handleCourseSelect = (course) => {
    setSelectedCourses(course);
    setRecipeData({ ...recipeData, course: course });
  };

  const handleMainIngredientSelect = (ingredient) => {
    setSelectedMainIngredients(ingredient);
    setRecipeData({ ...recipeData, mainIngredient: ingredient });
  };

  const handleDietSelect = (diet) => {
    setSelectedDiets(diet);
    setRecipeData({ ...recipeData, diet: diet });
  };

  // save the data
  const navigation = useNavigation();
  const save = async () => {
    console.log("saved");
  };

  // monitor changes in the form
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
            <TextInput
              style={styles.input}
              placeholder="Minuuttia"
              keyboardType="numeric"
              onChangeText={(text) =>
                setRecipeData({ ...recipeData, prepTime: text })
              }
            ></TextInput>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Kokkausaika</Text>
            <TextInput
              style={styles.input}
              placeholder="Minuuttia"
              keyboardType="numeric"
              onChangeText={(text) =>
                setRecipeData({ ...recipeData, cookTime: text })
              }
            ></TextInput>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Ruokalaji</Text>
            <CustomCheckBox
              options={courseOptions}
              selectedItems={selectedCourses}
              onSelect={handleCourseSelect}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Pääraaka-aine</Text>
            <CustomCheckBox
              options={mainIngredientOptions}
              selectedItems={selectedMainIngredients}
              onSelect={handleMainIngredientSelect}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Ruokavalio</Text>
            <CustomCheckBox
              options={dietOptions}
              selectedItems={selectedDiets}
              onSelect={handleDietSelect}
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
    height: 40,
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
