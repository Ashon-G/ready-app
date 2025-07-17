import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Linking,
} from "react-native";
const cardBg = require("../assets/images/earn-bg.png"); // ✅ use require for local image

export interface EarningsCardProps {
  amount: string;
  title: string;
  description: string;
  rating: string;
  time: string;
  href?: string;
  images: {
    icon1: string;
    icon2: string;
    icon3: string;
  };
}

const ACCENT_COLORS = ["#FFA500", "#32CD32", "#9370DB", "#1E90FF"];

export default function EarningsCard({
  amount,
  title,
  description,
  rating,
  time,
  href,
  images,
}: EarningsCardProps) {
  const handlePress = () => {
    if (href) {
      Linking.openURL(href);
    }
  };

  const randomColor =
    ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <View style={[styles.cardWrapper, { backgroundColor: randomColor }]}>
        <ImageBackground
          source={cardBg}
          resizeMode="cover"
          style={styles.bgImage}
          imageStyle={styles.bgImageInner}
        >
          <View style={styles.cardContent}>
            <View style={styles.amountPill}>
              <Text style={styles.amountText}>${amount}</Text>
            </View>
            <View style={styles.contentColumn}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.time}>{time}</Text>
              <Text style={styles.description}>{description}</Text>
              <Text style={styles.rating}>⭐ {rating}</Text>
              <View style={styles.iconsRow}>
                <Image source={{ uri: images.icon1 }} style={styles.icon} />
                <Image source={{ uri: images.icon2 }} style={styles.icon} />
                <Image source={{ uri: images.icon3 }} style={styles.icon} />
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    margin: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  bgImage: {
    width: "100%",
  },
  bgImageInner: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  amountPill: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  amountText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 26,
  },
  contentColumn: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  time: {
    fontSize: 12,
    color: "#eee",
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: "#fefefe",
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
  iconsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
});
