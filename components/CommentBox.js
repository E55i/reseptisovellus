import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { AntDesign } from "@expo/vector-icons";

export default function CommentBox({ comment, created, likes, commentUserId }) {
  // Tähän komponenttiin pitää lisätä tykkäyksen tallennus ja tykkäysmäärän päivitys kun sydäntä on klikattu
  const [isClicked, setIsClicked] = useState(false);
  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    //hae profiilikuva ja username
    const database = getDatabase();
    // Fetch user data
    const userRef = ref(database, "users/" + commentUserId);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserName(userData.username);
          setPhotoUrl(userData.photo);
        }
      })
      .catch((error) => {
        ShowAlert("Virhe", "Tapahtui virhe käyttäjätietojen haussa.");
        console.error("Error fetching user data:", error);
      });
  }, []);

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
        {photoUrl ? (
          <Image style={styles.profilePicture} source={{ uri: photoUrl }} />
        ) : (
          <Image
            style={styles.profilePicture}
            source={require("../assets/default_profile_picture.png")}
          />
        )}
        {/*If the comment was written by a user whose user account has been deleted, the name will be displayed as "Tuntematon" */}
        <Text style={styles.userNameText}>{userName ? userName : "Tuntematon"} kommentoi</Text>
      </View>
      <Text style={styles.createdText}>{created}</Text>
      {/*Tee tähän päivämäärän näyttäminen */}
      <Text style={styles.commentText}>{comment}</Text>
      <View style={styles.likeInfo}>
        <Text style={styles.likerText}>{likes ? likes : "0"} tykkää tästä</Text>
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
    fontSize: 18,
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
  createdText: {
    fontSize: 12,
    alignSelf: "flex-start",
    paddingLeft: 4,
    paddingBottom: 2,
  },
  commentText: {
    fontSize: 14,
    alignSelf: "flex-start",
    paddingLeft: 4,
  },
  likeInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    paddingLeft: 4,
  },
  likerText: {
    fontSize: 12,
  },
});
