import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import ShowAlert from "./ShowAlert";

export default function Categories() {
  const [isClicked, setIsClicked] = useState(false);
  //tee ominaisuus, että mainos näytetään kategorioiden jälkeenvain jos  käyttäjällä ei ole premium tilausta
  // säädä elementtien varjostusta, tutki sekä androidin että iosin varjostukset

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /*Do something*/
        }}
      >
        <Text style={styles.text}>Herkut</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /*Do something*/
        }}
      >
        <Text style={styles.text}>Välipalat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /*Do something*/
        }}
      >
        <Text style={styles.text}>Klassikot</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /*Do something*/
        }}
      >
        <Text style={styles.text}>Kasvisruoat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /*Do something*/
        }}
      >
        <Text style={styles.text}>kanaruoat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "white",
    elevation: 7,
    shadowColor: "#000000",
    overflow: "hidden",
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 16,
    marginTop: 8,
  },
  text: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 2,
    borderColor: "#47A73E",
    borderRadius: 10,
    //Shadow properties for
    //shadowColor: '#000',
    //Shadow properties for iOS
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.2,
    //shadowRadius: 2,
  },
});
