import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import React from "react";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";

export default function ButtonWithIcon({
  icon,
  color,
  width,
  title,
  iconColor = "#fff",
  library = "ant",
  onPress,
}) {
  return (
    <TouchableOpacity
      style={{
        ...styles.buttonContainer,
        backgroundColor: color,
        width: width || "auto",
      }}
      onPress={onPress}
    >
      {library == "ant" && (
        <AntDesign name={icon} size={24} color={iconColor} />
      )}
      {library == "materialcom" && (
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      )}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

export function RoundButtonWithIcon({
  icon,
  iconColor = "#fff",
  color,
  borderColor = "transparent",
  library = "ant",
  onPress,
}) {
  return (
    <TouchableOpacity
      style={{
        ...styles.roundButton,
        backgroundColor: color,
        borderColor: borderColor,
      }}
      onPress={onPress}
    >
      {library == "ant" && (
        <AntDesign name={icon} size={24} color={iconColor} />
      )}
      {library == "iconicons" && (
        <Ionicons name={icon} size={24} color={iconColor} />
      )}
      {library == "materialcom" && (
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      )}
      {library == "feather" && (
        <Feather name={icon} size={24} color={iconColor} />
      )}
      {library == "fontawesome" && (
        <FontAwesome name={icon} size={24} color={iconColor} />
      )}
    </TouchableOpacity>
  );
}

export function SquareButtonWithIcon({
  icon,
  iconColor,
  color,
  borderColor,
  onPress,
}) {
  return (
    <View
      style={{
        ...styles.squareButton,
        backgroundColor: color || "#fff",
        borderColor: borderColor || "transparent",
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <AntDesign name={icon} size={80} color={iconColor || "#fff"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 10,
    ...Platform.select({
      android: {
        elevation: 7,
        overflow: "hidden",
      },
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
    }),
  },
  text: {
    textTransform: "uppercase",
    fontSize: 16,
    color: "#fff",
  },
  roundButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    ...Platform.select({
      android: {
        elevation: 7,
        overflow: "hidden",
      },
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
    }),
  },
  squareButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 6,
    ...Platform.select({
      android: {
        elevation: 7,
        overflow: "hidden",
      },
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
    }),
  },
});
