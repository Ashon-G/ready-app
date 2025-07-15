import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.card}>
      <View style={styles.headerMainRow}>
        <Image
          source={{
            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/56uwmmji_expires_30_days.png",
          }}
          style={styles.avatarImage}
          resizeMode="stretch"
        />
        <View style={styles.greetingColumn}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.userNameText}>Hey Katherine 👋</Text>
        </View>
        <View style={styles.pointsRow}>
          <View style={styles.pointsBadgeWrapper}>
            <View style={styles.pointsBadgeBox} />
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/zpx8dvef_expires_30_days.png",
              }}
              style={styles.coinImage}
              resizeMode="stretch"
            />
          </View>
          <Text style={styles.pointsText}>242</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1, // Add this
    borderColor: "#D3D3D3",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  headerMainRow: { flexDirection: "row", alignItems: "center" },
  avatarImage: { width: 48, height: 48, borderRadius: 24 },
  greetingColumn: { marginLeft: 12 },
  welcomeText: { fontSize: 14, color: "#888" },
  userNameText: { fontSize: 16, fontWeight: "600" },
  pointsText: { fontSize: 16, fontWeight: "bold" },
  pointsRow: { flexDirection: "row", alignItems: "center", marginLeft: "auto" },
  pointsBadgeWrapper: { position: "relative", marginRight: 8 },
  pointsBadgeBox: {
    width: 16,
    height: 16,
    backgroundColor: "#FFD700",
    borderRadius: 8,
    position: "absolute",
    top: -4,
    left: -4,
  },
  coinImage: { width: 32, height: 32 },
});
