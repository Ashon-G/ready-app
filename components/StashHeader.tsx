import React from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export type StashHeaderProps = { coins: string };

export default function StashHeader({ coins }: StashHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerBottom}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.coinsContainer}>
          <Image
            source={require("../assets/images/credits.png")}
            style={styles.coinImage}
          />
          <Text style={styles.coinText}>{coins}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="person" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: "#3b82f6", padding: 16 },
  headerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  iconButton: { padding: 4 },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  coinImage: { width: 32, height: 32, marginRight: 4 },
  coinText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});
