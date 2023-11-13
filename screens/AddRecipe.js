import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import DefaultAppBar from "../components/DefaultAppBar";
import ButtonWithIcon from "../components/CustomButtons";
import { Colors } from "../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import CustomCheckBox from "../components/CustomCheckBox";

export default function AddRecipe({ ...props }) {
  const [recipeData, setRecipeData] = useState({
    userId: "", // kun autentikaatio valmis: auth.currentUser.uid,
    title: "",
    course: "", // aamiainen/välipala...
    mainIngredient: "",
    diet: "",
    source: "", // kirjan nimi/nettisivu...
    servingSize: "", // annoskoko
    prepTime: "",
    cookTime: "",
    rating: "",
    incredients: "",
    instructions: "",
    notes: "",
    calories: "",
    totalFat: "",
    saturatedFat: "",
    totalCarb: "",
    sugars: "",
    protein: "",
    salt: "",
  });

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedMainIngredients, setSelectedMainIngredients] = useState([]);

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

  const handleCourseSelect = (selected) => {
    setSelectedCourses(selected);
    setRecipeData({ ...recipeData, course: selected });
  };

  const handleMainIngredientSelect = (selected) => {
    setSelectedMainIngredients(selected);
    setRecipeData({ ...recipeData, mainIngredient: selected });
  };

  // save the data
  const navigation = useNavigation();
  const save = async () => {
    console.log("saved");
  };

  return (
    <View style={styles.container}>
      <DefaultAppBar {...props} />
      <View style={styles.sectionRow}>
        <Text style={styles.header}>Otsikko</Text>
        <TextInput
          style={styles.input}
          placeholder="Reseptin nimi"
          onChangeText={(text) => setRecipeData({ ...recipeData, title: text })}
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
          color={Colors.primary}
          width={140}
          title="Tallenna"
          onPress={() => {
            save();
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 8,
    marginRight: 8,
  },
  section: {
    marginTop: 20,
    marginLeft: 8,
    marginRight: 8,
  },
  header: {
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    flex: 1,
    height: 40,
    marginBottom: 12,
    marginLeft: 12,
    marginRight: 12,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: Colors.secondary,
    borderRadius: 10,
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
  sectionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
});
