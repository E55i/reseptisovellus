import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

export default function ButtonWithIcon({ icon, color, width, title, onPress }) {
  return (
    <TouchableOpacity
      style={{
        ...styles.buttonContainer,
        backgroundColor: color,
        width: width || "auto",
      }}
      onPress={onPress}
    >
      <AntDesign name={icon} size={24} color="#fff" />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

export function RoundButtonWithIcon({
  icon,
  iconColor,
  color,
  borderColor,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={{
        ...styles.roundButton,
        backgroundColor: color,
        borderColor: borderColor || "transparent",
      }}
      onPress={onPress}
    >
      <AntDesign name={icon} size={32} color={iconColor || "#fff"} />
    </TouchableOpacity>
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
    width: 60,
    height: 60,
    borderRadius: 50,
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
});
