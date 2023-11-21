import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState } from "react";

export default function RatingBar() {
  const [rating, setRating] = useState(0);
  const ratingScale = [1, 2, 3, 4, 5];

  return (
    <View style={styles.ratingBar}>
      {ratingScale.map((item) => {
        return (
          <TouchableOpacity
            key={item}
            onPress={() => {
              setRating(item);
            }}
          >
            <Image
              style={styles.starImage}
              source={
                item <= rating
                  ? require("../assets/star_filled.png")
                  : require("../assets/star_corner.png")
              }
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  ratingBar: {
    justifyContent: "center",
    flexDirection:'row'
  },
  starImage: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
});
