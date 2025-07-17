import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import StreakDrawer from "./StreakDrawer";
import { updateUserStreak } from "@/lib/streak";

export default function Header() {
  const [earnings, setEarnings] = useState(0);
  const [streak, setStreak] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let unsubSnap: () => void = () => {};
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const s = await updateUserStreak(user.uid);
        setStreak(s);
        unsubSnap = onSnapshot(doc(db, 'users', user.uid), (snap) => {
          const data: any = snap.data();
          setEarnings(data?.earnings ?? 0);
          setStreak(data?.streak ?? s);
        });
      }
    });
    return () => {
      unsubSnap();
      unsubAuth();
    };
  }, []);

  const progress = Math.min((earnings / 5) * 100, 100);

  return (
    <View style={styles.container}>
      {/* Left side badges */}
      <View style={styles.leftRow}>
        <View style={styles.badge}>
          <Image
            source={{ uri: "https://img.icons8.com/color/48/trophy.png" }}
            style={styles.icon}
          />
        </View>
        <TouchableOpacity style={styles.badge} onPress={() => setDrawerOpen(true)}>
          <Image
            source={{ uri: "https://img.icons8.com/color/48/fire-element.png" }}
            style={styles.icon}
          />
          <Text style={styles.badgeText}>{streak}</Text>
        </TouchableOpacity>
      </View>

      {/* Right side earnings */}
      <View style={styles.rightColumn}>
        <Text style={styles.earningsText}>
          <Text style={styles.earned}>${earnings.toFixed(2)}</Text> / $5.00
        </Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>
      <StreakDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} streak={streak} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDEDA3",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  earningsText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  earned: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  progressBarBackground: {
    width: 100,
    height: 6,
    backgroundColor: "#e0e0f0",
    borderRadius: 3,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#4BEFAA",
    borderRadius: 3,
  },
});
