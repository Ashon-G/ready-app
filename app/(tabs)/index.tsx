import EarningsCard from "@/components/EarningsCard";
import VideoAd from "@/components/VideoAd";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { earnings } from "../constants/mockData";
import { fetchSurveys, Survey } from "@/lib/cpx";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import bonusBg from "@/assets/images/videoad-bg.png";
import Header from "@/components/Header";
import StreakDrawer from "@/components/StreakDrawer";
import { updateUserStreak } from "@/lib/streak";

export default function HomeScreen() {
  const [adVisible, setAdVisible] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [streakDrawerOpen, setStreakDrawerOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [earningsVal, setEarningsVal] = useState(0);
  const [extendedToday, setExtendedToday] = useState(false);
  const [progress, setProgress] = useState(0);
  const [achievements, setAchievements] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data: any = snap.data();
        if (data) {
          const info = {
            birthday: new Date(data.dob),
            gender: data.gender as "m" | "f",
            country: data.country,
            zip: data.zip,
          };
          const s = await fetchSurveys(user.uid, info);
          setSurveys(s);
        }
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    let unsubSnap: () => void = () => {};
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const res = await updateUserStreak(user.uid);
        setStreak(res.streak);
        setExtendedToday(res.extendedToday);
        setProgress(res.progress);
        setAchievements(res.achievements);
        unsubSnap = onSnapshot(doc(db, 'users', user.uid), (snap) => {
          const data: any = snap.data();
          setEarningsVal(data?.earnings ?? 0);
          setStreak(data?.streak ?? res.streak);
          setProgress(data?.achievementProgress ?? res.progress);
          setAchievements(data?.achievements ?? res.achievements);
        });
      }
    });
    return () => {
      unsubSnap();
      unsubAuth();
    };
  }, []);
  return (
    <SafeAreaView style={styles.safeContainer}>
      <Header
        onPressStreak={() => setStreakDrawerOpen(true)}
        earnings={earningsVal}
        streak={streak}
      />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Video Bonus */}
        <TouchableOpacity onPress={() => setAdVisible(true)}>
          <ImageBackground
            source={bonusBg}
            style={[styles.card, styles.bonusBackground]}
            imageStyle={styles.bonusBackgroundImage}
          >
            <View style={styles.bonusRow}>
              <Image
                source={{
                  uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/fr22k70p_expires_30_days.png",
                }}
                style={styles.bonusImageLeft}
                resizeMode="stretch"
              />
              <View style={styles.bonusTextColumn}>
                <Text style={styles.bonusTitle}>3¢ Video Ad Bonus</Text>
                <Text style={styles.bonusSubtitle}>
                  Lorem ipsum dolor sit amet. The graphic and typographic.
                </Text>
              </View>
              <Image
                source={{
                  uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/w47n4prh_expires_30_days.png",
                }}
                style={styles.bonusImageRight}
                resizeMode="stretch"
              />
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Surveys */}
        <View style={styles.card}>
          <View style={styles.surveyRow}>
            <Image
              source={require("@/assets/images/check-circle-icon.svg")}
              style={styles.surveyIcon}
              resizeMode="stretch"
            />

            <Text style={styles.surveyTitle}>Surveys</Text>
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/edsp5gqn_expires_30_days.png",
              }}
              style={styles.surveyFilterIcon}
              resizeMode="stretch"
            />
            <View style={styles.surveySpacer} />
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/28w0k1ah_expires_30_days.png",
              }}
              style={styles.surveyBonusIcon}
              resizeMode="stretch"
            />
          </View>
        </View>

        {/* Earnings Cards */}
        <View style={styles.card}>
          {(surveys.length ? surveys : earnings).map((item, index) => {
            const props =
              "href" in item
                ? {
                    amount: item.payout_publisher_usd,
                    title: `Survey ${item.id}`,
                    description: `Earn ${item.payout} in your currency`,
                    rating: item.conversion_rate,
                    time: `${item.loi} Min`,
                    href: item.href,
                    images: earnings[0].images,
                  }
                : item;
            return (
              <View key={index} style={styles.earningCardWrapper}>
                <EarningsCard {...props} />
              </View>
            );
          })}
        </View>
      </ScrollView>

      <StreakDrawer
        visible={streakDrawerOpen}
        onClose={() => setStreakDrawerOpen(false)}
        streak={streak}
        progress={progress}
        extendedToday={extendedToday}
        achievements={achievements}
      />
      <VideoAd visible={adVisible} onClose={() => setAdVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#f8f9fb" },
  scrollContainer: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  balanceRow: { flexDirection: "row", alignItems: "center" },
  walletImage: { width: 32, height: 32, marginRight: 8 },
  balanceText: { fontSize: 18, fontWeight: "600" },
  balanceBarContainer: { marginTop: 10 },
  balanceBar: {
    height: 6,
    backgroundColor: "#000",
    borderRadius: 3,
    width: "100%",
  },
  bonusRow: { flexDirection: "row", alignItems: "center" },
  bonusImageLeft: { width: 40, height: 40 },
  bonusTextColumn: { flex: 1, paddingHorizontal: 10 },
  bonusTitle: { fontSize: 16, fontWeight: "600" },
  bonusSubtitle: { fontSize: 12, color: "#555" },
  bonusImageRight: { width: 40, height: 40 },
  surveyRow: { flexDirection: "row", alignItems: "center" },
  surveyIcon: { width: 32, height: 32 },
  surveyTitle: { fontSize: 16, fontWeight: "600", marginLeft: 10 },
  surveyFilterIcon: { width: 24, height: 24, marginLeft: 10 },
  surveySpacer: { flex: 1 },
  surveyBonusIcon: { width: 32, height: 32 },
  earningCardWrapper: { marginBottom: 12 },
  bonusBackground: {
    height: 100,
    width: 335,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderWidth: 1, // Add this
    borderColor: "#D3D3D3",
  },

  bonusBackgroundImage: {
    borderRadius: 16,
    resizeMode: "cover",
  },
});
