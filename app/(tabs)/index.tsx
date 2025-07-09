import EarningsCard from "@/components/EarningsCard";
import React from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { earnings } from "../constants/mockData";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerSection}>
          

          <View style={styles.headerMainRow}>
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/56uwmmji_expires_30_days.png" }}
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
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/zpx8dvef_expires_30_days.png" }}
                  style={styles.coinImage}
                  resizeMode="stretch"
                />
              </View>
              <Text style={styles.pointsText}>242</Text>
            </View>
          </View>
        </View>

        {/* Balance and Bonus */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/iae46afr_expires_30_days.png" }}
                style={styles.walletImage}
                resizeMode="stretch"
              />
              <Text style={styles.balanceText}>$2.97</Text>
            </View>
            <View style={styles.balanceBarContainer}>
              <View style={styles.balanceBar} />
            </View>
          </View>

          <View style={styles.bonusRow}>
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/fr22k70p_expires_30_days.png" }}
              style={styles.bonusImageLeft}
              resizeMode="stretch"
            />
            <View style={styles.bonusTextColumn}>
              <Text style={styles.bonusTitle}>3$ Video Ad Bonus</Text>
              <Text style={styles.bonusSubtitle}>
                Lorem ipsum dolor sit amet. The graphic and typographic.
              </Text>
            </View>
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/w47n4prh_expires_30_days.png" }}
              style={styles.bonusImageRight}
              resizeMode="stretch"
            />
          </View>
        </View>

        {/* Survey Section */}
        <View style={styles.surveyRow}>
          <Image
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/c85k7hyy_expires_30_days.png" }}
            style={styles.surveyIcon}
            resizeMode="stretch"
          />
          <Text style={styles.surveyTitle}>Surveys</Text>
          <Image
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/edsp5gqn_expires_30_days.png" }}
            style={styles.surveyFilterIcon}
            resizeMode="stretch"
          />
          <View style={styles.surveySpacer} />
          <Image
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SbVinpZIfd/28w0k1ah_expires_30_days.png" }}
            style={styles.surveyBonusIcon}
            resizeMode="stretch"
          />
        </View>
        <ScrollView>
        {earnings.map((item, index) => (
          <EarningsCard key={index} {...item} />
        ))}
      </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flex: 1 },
  headerSection: { padding: 16 },
  headerTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  timeText: { fontSize: 16, fontWeight: "600" },
  statusBarImage: { width: 50, height: 20 },
  headerMainRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  avatarImage: { width: 48, height: 48 },
  greetingColumn: { marginLeft: 12 },
  welcomeText: { fontSize: 14, color: "#888" },
  userNameText: { fontSize: 16, fontWeight: "600" },
  pointsRow: { flexDirection: "row", alignItems: "center", marginLeft: "auto" },
  pointsBadgeWrapper: { position: "relative", marginRight: 8 },
  pointsBadgeBox: { width: 16, height: 16, backgroundColor: "#FFD700", borderRadius: 8, position: "absolute", top: -4, left: -4 },
  coinImage: { width: 32, height: 32 },
  pointsText: { fontSize: 16, fontWeight: "bold" },
  balanceSection: { paddingHorizontal: 16, marginTop: 20 },
  balanceCard: { backgroundColor: "#f5f5f5", borderRadius: 12, padding: 16 },
  balanceRow: { flexDirection: "row", alignItems: "center" },
  walletImage: { width: 32, height: 32, marginRight: 8 },
  balanceText: { fontSize: 18, fontWeight: "600" },
  balanceBarContainer: { marginTop: 10 },
  balanceBar: { height: 6, backgroundColor: "#000", borderRadius: 3, width: "100%" },
  bonusRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  bonusImageLeft: { width: 40, height: 40 },
  bonusTextColumn: { flex: 1, paddingHorizontal: 10 },
  bonusTitle: { fontSize: 16, fontWeight: "600" },
  bonusSubtitle: { fontSize: 12, color: "#555" },
  bonusImageRight: { width: 40, height: 40 },
  surveyRow: { flexDirection: "row", alignItems: "center", marginTop: 20, paddingHorizontal: 16 },
  surveyIcon: { width: 32, height: 32 },
  surveyTitle: { fontSize: 16, fontWeight: "600", marginLeft: 10 },
  surveyFilterIcon: { width: 24, height: 24, marginLeft: 10 },
  surveySpacer: { flex: 1 },
  surveyBonusIcon: { width: 32, height: 32 },
});
