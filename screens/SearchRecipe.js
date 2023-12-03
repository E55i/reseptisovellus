import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import RecipeCard from "../components/RecipeCard";
import GoBackAppBar from "../components/GoBackAppBar";
import { getUser } from "../components/FirebaseConfig";
import { Colors } from "../styles/Colors";
import { Ionicons } from "@expo/vector-icons";
import GetRecipes from "../components/GetRecipes";
import { RoundButtonWithIcon } from "../components/CustomButtons";

export default function SearchRecipe({ ...props }) {
  const [isPremium, setIsPremium] = useState("0");
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState();
  const [loading, setLoading] = useState(true);

  // fetch the premium status of the user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        if (userData) {
          setIsPremium(userData.premium);
        } else {
          console.log("User data not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.length > 2) {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
      console.log(filteredData);
    }
  };

  const filterSearchResults = (filter) => {
    if (filter === "course") {
      // filter by food course
    } else if (filter === "servingSize") {
      // filter by serving size
    } else if (filter === "time") {
      // filter by cooking time
    } else if (filter === "diet") {
      // filter by diet
    } else if (filter === "liked") {
      // filter by most liked recipes
    } else if (filter === "rating") {
      // filter by rating
    }
  };

  const showAllRecipes = () => {
    setFilteredData(data);
  };

  return (
    <>
      <GoBackAppBar {...props} />
      <GetRecipes
        setData={(data) => {
          setData(data);
          setLoading(false);
        }}
      />
      {loading ? (
        <ActivityIndicator size="large" animating={true} />
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.container}>
            {isPremium === "0" && (
              <Image
                style={styles.add}
                source={require("../assets/mainos_vaaka.png")}
              />
            )}
            <View style={styles.section}>
              <View style={styles.searchBar}>
                <TextInput
                  style={styles.input}
                  placeholder="Haku"
                  autoCapitalize="none"
                  clearButtonMode="always"
                  autoCorrect={false}
                  value={query}
                  onChangeText={(text) => handleSearch(text)}
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() => console.log("search")}
                >
                  <Ionicons name="search-outline" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonRow}>
                <RoundButtonWithIcon
                  icon="food-apple-outline"
                  iconColor="#fff"
                  color={Colors.primary}
                  library="materialcom"
                  onPress={filterSearchResults("course")}
                />
                <RoundButtonWithIcon
                  icon="account-group"
                  iconColor="#fff"
                  color={Colors.primary}
                  library="materialcom"
                  onPress={filterSearchResults("servingSize")}
                />
                <RoundButtonWithIcon
                  icon="clock"
                  iconColor="#fff"
                  color={Colors.primary}
                  library="feather"
                  onPress={filterSearchResults("time")}
                />
                <RoundButtonWithIcon
                  icon="food-fork-drink"
                  iconColor="#fff"
                  color={Colors.primary}
                  library="materialcom"
                  onPress={filterSearchResults("diet")}
                />
                <RoundButtonWithIcon
                  icon="hearto"
                  iconColor="#fff"
                  color={Colors.primary}
                  library="ant"
                  onPress={filterSearchResults("liked")}
                />
                <RoundButtonWithIcon
                  icon="staro"
                  iconColor="#fff"
                  color={Colors.primary}
                  library="ant"
                  onPress={filterSearchResults("rating")}
                />
                <RoundButtonWithIcon
                  icon="filter-remove-outline"
                  iconColor="#fff"
                  color={Colors.grey}
                  library="materialcom"
                  onPress={showAllRecipes}
                />
              </View>

              <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <RecipeCard
                    key={item.id}
                    recipeId={item.id}
                    prepTime={item.prepTime}
                    urlToImage={item.photo}
                    recipeName={item.title}
                    cookTime={item.cookTime}
                    servingSize={item.servingSize}
                    backgroundColor={props.backgroundColor}
                  />
                )}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  section: {
    flex: 1,
    marginBottom: 20,
    marginLeft: 12,
    marginRight: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    marginLeft: 12,
    marginRight: 12,
    gap: 8,
  },
  add: {
    width: 350,
    height: 100,
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },
  searchButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
    marginRight: 12,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
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
  input: {
    height: 44,
    width: "80%",
    marginLeft: 12,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
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
});
