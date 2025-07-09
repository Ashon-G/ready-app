import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";

export interface EarningsCardProps {
  amount: string;
  title: string;
  description: string;
  rating: string;
  time: string;
  images: {
    bg: string;
    icon1: string;
    icon2: string;
    icon3: string;
  };
}

export default function EarningsCard({
  amount,
  title,
  description,
  rating,
  time,
  images,
}: EarningsCardProps) {
  return (
    <ImageBackground source={{ uri: images.bg }} resizeMode="stretch" style={styles.bg}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.amount}>${amount}</Text>
        </TouchableOpacity>
        <View style={styles.iconsColumn}>
          <Image source={{ uri: images.icon1 }} style={styles.icon} />
          <Image source={{ uri: images.icon2 }} style={styles.icon} />
          <Image source={{ uri: images.icon3 }} style={styles.icon} />
        </View>
        <View style={styles.textColumn}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.rating}>⭐ {rating}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { margin: 12, borderRadius: 12, overflow: "hidden" },
  row: { flexDirection: "row", padding: 16 },
  button: { backgroundColor: "#000", borderRadius: 8, padding: 8 },
  amount: { color: "#fff", fontWeight: "bold" },
  iconsColumn: { justifyContent: "space-between", marginLeft: 12 },
  icon: { width: 32, height: 32, marginVertical: 4 },
  textColumn: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: "600" },
  time: { fontSize: 12, color: "#666" },
  description: { fontSize: 12, marginTop: 4 },
  rating: { marginTop: 6, color: "#333" },
});
