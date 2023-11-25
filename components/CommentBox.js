import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

export default function CommentBox({ comment }) {
  // Tähän komponenttiin pitää lisätä tykkäyksen tallennus ja tykkäysmäärän päivitys kun sydäntä on klikattu
  const [isClicked, setIsClicked] = useState(false);

  const handleLike = () => {
    if (isClicked) {
      setIsClicked(false);
    } else {
      setIsClicked(true);
    }
  };

  return (
    <View style={styles.box}>
      <View style={styles.pictureAndUser}>
        <Image
          style={styles.profilePicture}
          source={require("../assets/default_profile_picture.png")}
        />
        <Text style={styles.userNameText}>Ezzi kommentoi</Text>
      </View>
      <Text style={styles.commentText}>Tämä on tosi pitkän pitkän pitkän pitkän pitkän pitkä kommentti teksti jolla testataan tekstin asettumista kommenttiboxissa.</Text>
      <View style={styles.likeInfo}>
        <Text style={styles.likerText}>1100 tykkää tästä</Text>
        <TouchableOpacity onPress={handleLike}>
          {isClicked ? (
            <AntDesign name="heart" size={30} color="#FF573A" />
          ) : (
            <AntDesign name="hearto" size={30} color="#8B8B8B" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
      borderRadius: 20,
      borderColor: "#47A73E",
      borderWidth: 2,
      padding: 8,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 16,
  },
  pictureAndUser: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userNameText: {
    fontSize: 20,
    color: "#8B8B8B",
    textAlign: "center",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginRight: 36,
    marginLeft: 2,
  },
  commentText: {
    fontSize: 14,
    alignSelf: "center",
  },
  likeInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  likerText: {
    fontSize: 12,
  },
});
