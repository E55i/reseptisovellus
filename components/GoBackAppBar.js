import React from "react";
import { StyleSheet } from "react-native";
import { AppBar, HStack, IconButton } from "@react-native-material/core";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function GoBackAppBar({ backgroundColor, navigation }) {
  return (
    <AppBar
      backgroundColor={backgroundColor}
      title={(props) => (
        <HStack style={styles.centerContainer}>
          <IconButton
          style={styles.icon}
          icon={<Ionicons name="arrow-back" size={28} color="white" />}
          onPress={() => navigation.goBack()}
          {...props}
        />
          <IconButton
          style={styles.icon}
            icon={<Ionicons name="search-outline" size={28} color="white" />}
            onPress={() => navigation.navigate("SearchRecipe")}
            {...props}
          />
           <IconButton
           style={styles.icon}
            icon={
              <MaterialIcons name="my-library-books" size={28} color="white" />
            }
            onPress={() => navigation.navigate("OwnRecipes")}
            {...props}
          />
          <IconButton
          style={styles.icon}
            icon={<FontAwesome name="user-circle-o" size={28} color="white" />}
            onPress={() => navigation.navigate("Profile")}
            {...props}
          />
        </HStack>
      )}
    />
  );
}
const styles = StyleSheet.create({
  centerContainer: {
    justifyContent: "center",
    alignItems: 'center',
  },
  icon:{
    paddingRight:'13%',
    paddingLeft:'13%',
  }
});
