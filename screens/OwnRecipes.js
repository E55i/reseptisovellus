import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { GetOwnRecipes } from "../components/GetRecipes";
import { Colors } from "../styles/Colors";
import GoBackAppBar from "../components/GoBackAppBar";
import RecipeCard from "../components/RecipeCard";
import ButtonWithIcon, { IconButton } from "../components/CustomButtons";
import { useNavigation } from "@react-navigation/native";

export default function OwnRecipes({ ...props }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notEditing, setNotEditing] = useState(true);

  const navigation = useNavigation();

  return (
    <>
      <GoBackAppBar {...props} />
      <View style={styles.container}>
        <ScrollView>
          <GetOwnRecipes
            setData={(recipes) => {
              setRecipes(recipes);
              setLoading(false);
            }}
            order={"created"} // if you want to order by some other feature, add 'recipeData.' before the featurename, e.g. "recipeData.title"
            orderDirection={"desc"}
          />
          <View style={styles.title}>
            <Text style={{ fontSize: 28 }}>Omat reseptit</Text>
          </View>
          {recipes.length > 0 ? (
            loading ? (
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
                color={Colors.secondary}
              />
            ) : (
              <>
                <View style={{ alignItems: "center", marginBottom: 12 }}>
                  <ButtonWithIcon
                    icon="setting"
                    color={notEditing ? Colors.secondary : Colors.grey}
                    width={140}
                    title="Muokkaa"
                    onPress={() => {
                      setNotEditing(!notEditing);
                    }}
                  />
                </View>
                {notEditing ? (
                  recipes.map((item) => (
                    <RecipeCard
                      key={item.id}
                      recipeId={item.id}
                      prepTime={item.prepTime}
                      urlToImage={item.photo}
                      recipeName={item.title}
                      cookTime={item.cookTime}
                      servingSize={item.servingSize}
                      premium={item.premium}
                    />
                  ))
                ) : (
                  <>
                    {recipes.map((item) => (
                      <View key={item.id}>
                        <RecipeCard
                          key={`${item.id}-edit`}
                          recipeId={item.id}
                          prepTime={item.prepTime}
                          urlToImage={item.photo}
                          recipeName={item.title}
                          cookTime={item.cookTime}
                          servingSize={item.servingSize}
                          premium={item.premium}
                        />
                        <View style={styles.editingButton}>
                          <IconButton
                            key={`${item.id}-button`}
                            icon="setting"
                            iconColor="#fff"
                            color={Colors.grey}
                            onPress={() => {
                              navigation.navigate({
                                name: "RecipeEdit",
                                params: {
                                  recipeId: item.id,
                                },
                                merge: true,
                              });
                            }}
                          />
                        </View>
                      </View>
                    ))}
                  </>
                )}
              </>
            )
          ) : (
            <>
              <Text style={styles.infoText}>
                Täältä löydät lisäämäsi reseptit. Näyttää sille, että et ole
                vielä ehtinyt lisätä yhtään reseptiä.
              </Text>
              <Text style={styles.infoText}>
                Pääset lisäämään uusia reseptejä etusivulla "+"-painikkeen
                avulla.
              </Text>
              <Image
                style={styles.image}
                source={require("../assets/addRecipe_advice.png")}
              />
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    flex: 1,
    height: 72,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  editingContainer: {},
  editingButton: {
    position: "absolute",
    right: 24,
    top: 20,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  image: {
    alignSelf: "center",
    width: 280,
    height: 45,
  },
});
