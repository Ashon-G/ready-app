import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReadyPlayerMe, { RPMUser } from "@/lib/ReadyPlayerMe";
import BottomDrawer from "../../components/BottomDrawer";
import LootCard from "../../components/LootCard";
import StashHeader from "../../components/StashHeader";
import GLBModelViewer from "../../components/GLBModelViewer";
import { lootItems } from "../constants/lootData";

StashScreen.options = {
  headerShown: false,
};


const DEFAULT_USER = {
  username: "@Ashon",
  coins: "1,155",
  rank: "#138871",
};

const APP_ID = "683c0f07d8f16f5cf857a864";
const SUBDOMAIN = "arcadia-next";
const AVATAR_URL_KEY = "rpm_avatar_url";
const USER_TOKEN_KEY = "rpm_token";
const USER_ID_KEY = "rpm_user_id";
const DEFAULT_GLB_URL =
  "https://readyplayerme-assets.s3.amazonaws.com/animations/visage/female.glb";


export default function StashScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user] = useState(DEFAULT_USER);
  const [mainButtonLabel] = useState("SAKU BATTLES");
  const [newBadgeLabel] = useState("NEW");
  const [detailsLabel] = useState("Details");
  const [rpmUser, setRpmUser] = useState<RPMUser | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showCreator, setShowCreator] = useState(false);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      const storedUrl = await AsyncStorage.getItem(AVATAR_URL_KEY);
      if (storedUrl) setAvatarUrl(storedUrl);

      const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
      const id = await AsyncStorage.getItem(USER_ID_KEY);
      if (token && id) {
        setRpmUser({ id, token });
      } else {
        const newUser = await ReadyPlayerMe.createAnonymousUser(APP_ID);
        setRpmUser(newUser);
        await AsyncStorage.multiSet([
          [USER_ID_KEY, newUser.id],
          [USER_TOKEN_KEY, newUser.token],
        ]);
      }
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") {
      window.addEventListener("message", handleMessage as any);
      return () => window.removeEventListener("message", handleMessage as any);
    }
  }, [handleMessage]);

  const handleMessage = useCallback(async (event: any) => {
    const raw = event.nativeEvent?.data ?? event.data;
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.eventName === "v1.avatar.exported" && data.data?.url) {
        const url = data.data.url.replace(
          "https://api.readyplayer.me",
          "https://models.readyplayer.me"
        );
        setAvatarUrl(url);
        await AsyncStorage.setItem(AVATAR_URL_KEY, url);
        setShowCreator(false);
        return;
      }
    } catch {
      if (typeof raw === "string" && raw.startsWith("http")) {
        const url = raw.replace(
          "https://api.readyplayer.me",
          "https://models.readyplayer.me"
        );
        setAvatarUrl(url);
        await AsyncStorage.setItem(AVATAR_URL_KEY, url);
        setShowCreator(false);
      }
    }
  }, []);

  if (showCreator) {
    if (Platform.OS === "web") {
      const uri = `https://${SUBDOMAIN}.readyplayer.me/avatar?frameApi&clearCache`;
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <iframe
            src={uri}
            style={{ width: "100%", height: "100%", border: "none" }}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </SafeAreaView>
      );
    }
    return (
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={require("../../assets/avatarCreator.html")}
        onMessage={handleMessage}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <View style={styles.container}>
          <StashHeader coins={user.coins} />
          <View style={styles.detailsRow}>
            <View style={styles.avatarRow}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBak5aHgqR_B9odfm1jIehKDYNzyvFBfb48rHF-46hQRuPE7AvUarl-d2XwMC5C3m_3EwJgiT2vsNwoFOQ32sqBO_04aIwsg13yzoWNNs6bLYu5xLtiOIAZEQ862qMKwXDOphauSD3mGeQ0q-Y2tVfhHmUd_EsHqEUvG4S3_MSPCOrU9-VpokgOiaKK_BYI6nwA4syqynWSOJVl9tXuYF-LGybc0pbpkdxSRubhSjir2tZnM86A4OaIhPUzAmAbdJfkO8YpqMjWiokr",
                }}
                style={styles.avatar}
              />
              <View style={styles.avatarPlaceholder} />
              <View style={styles.avatarPlaceholder} />
            </View>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => setDrawerOpen(true)}
            >
              <Text style={styles.detailsButtonText}>{detailsLabel}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modelWrapper}>
            <GLBModelViewer modelUrl={avatarUrl ?? DEFAULT_GLB_URL} />
          </View>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => setShowCreator(true)}
          >
            <Text style={styles.detailsButtonText}>Customize Avatar</Text>
          </TouchableOpacity>
          <View style={styles.dots}>
            <View style={[styles.dot, { backgroundColor: "#3b82f6" }]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <View style={styles.userRow}>
            <Text style={styles.username}>{user.username}</Text>
            <MaterialIcons
              name="account-balance-wallet"
              size={24}
              color="gray"
            />
          </View>
          <TouchableOpacity style={styles.mainButton}>
            <Text style={styles.mainButtonText}>{mainButtonLabel}</Text>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>{newBadgeLabel}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.rankCard}>
            <View style={styles.rankLeft}>
              <View style={styles.rankIcon}>
                <MaterialIcons name="person" size={24} color="#666" />
              </View>
              <View>
                <Text style={styles.rankNumber}>{user.rank}</Text>
                <Text style={styles.rankLabel}>Rank</Text>
              </View>
            </View>
            <View style={styles.rankRight}>
              <Text style={styles.rankCoins}>{user.coins}</Text>
              <Text style={styles.rankLabel}>Coins</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="gray" />
          </View>
        </View>
      </ScrollView>
      <BottomDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <ScrollView>
          {lootItems.map((item, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <LootCard {...item} />
            </View>
          ))}
        </ScrollView>
      </BottomDrawer>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  avatarRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    marginLeft: 8,
  },
  detailsButton: {
    backgroundColor: "#f97316",
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  detailsButtonText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  modelWrapper: { alignItems: "center", marginTop: 16 },
  dots: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d5db",
    marginHorizontal: 2,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  username: { fontSize: 16, fontWeight: "600" },
  mainButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
  mainButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  newBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  rankCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  rankLeft: { flexDirection: "row", alignItems: "center" },
  rankIcon: {
    backgroundColor: "#e5e7eb",
    borderRadius: 9999,
    padding: 8,
    marginRight: 8,
  },
  rankNumber: { color: "#3b82f6", fontSize: 20, fontWeight: "bold" },
  rankLabel: { fontSize: 12, color: "#6b7280" },
  rankRight: { alignItems: "flex-end" },
  rankCoins: { color: "#f97316", fontSize: 20, fontWeight: "bold" },
});
