import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomDrawer from "../../components/BottomDrawer";
import LootCard from "../../components/LootCard";
import { lootItems } from "../constants/lootData";

StashScreen.options = {
  headerShown: false,
};

const { width, height } = Dimensions.get("window");

const DEFAULT_USER = {
  username: "@Ashon",
  coins: "1,155",
  rank: "#138871",
};

const SUBDOMAIN = "arcadia-next";
const AVATAR_STORAGE_KEY = "@avatar:url";

StashScreen.options = {
  headerShown: false,
};

export default function StashScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user] = useState(DEFAULT_USER);
  const [mainButtonLabel] = useState("SAKU BATTLES");
  const [newBadgeLabel] = useState("NEW");
  const [detailsLabel] = useState("Details");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showCreator, setShowCreator] = useState(false);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
      if (saved) {
        setAvatarUrl(saved);
      }
    })();
  }, []);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.eventName === "v1.avatar.exported") {
        const url = data.data.url;
        setAvatarUrl(url);
        AsyncStorage.setItem(AVATAR_STORAGE_KEY, url);
        setShowCreator(false);
      }
    } catch {}
  };

  if (showCreator) {
    const uri = `https://${SUBDOMAIN}.readyplayer.me/avatar?frameApi&clearCache`;
    return (
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ uri }}
        onMessage={handleMessage}
        injectedJavaScript={`(function() {\n  window.addEventListener('message', function(e) {\n    try {\n      const d = JSON.parse(e.data);\n      if (d.source !== 'readyplayerme') return;\n      if (d.eventName === 'v1.frame.ready') {\n        window.postMessage(JSON.stringify({ target: 'readyplayerme', type: 'subscribe', eventName: 'v1.avatar.exported' }), '*');\n      } else if (d.eventName === 'v1.avatar.exported') {\n        window.ReactNativeWebView.postMessage(e.data);\n      }\n    } catch (err) {}\n  });\n})();`}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Header coins={user.coins} />
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
            <GLBModelViewer modelUrl={avatarUrl || undefined} />
          </View>
          <View style={styles.dots}>
            <View style={[styles.dot, { backgroundColor: "#3b82f6" }]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <TouchableOpacity
            style={[styles.detailsButton, { alignSelf: "center", marginTop: 8 }]}
            onPress={() => setShowCreator(true)}
          >
            <Text style={styles.detailsButtonText}>Customize Avatar</Text>
          </TouchableOpacity>
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

type HeaderProps = { coins: string };

function Header({ coins }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerBottom}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.coinsContainer}>
          <Image
            source={require("../../assets/images/credits.png")} // adjust the path
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

function GLBModelViewer({ modelUrl }: { modelUrl?: string }) {
  const frame = useRef<number | null>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <GLView
      style={styles.glView}
      onContextCreate={async (gl) => {
        const { drawingBufferWidth: w, drawingBufferHeight: h } = gl;

        const scene = new THREE.Scene();

        // ✅ Subtle vertical gradient background
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 256;
        const context = canvas.getContext("2d");
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#Ffff00"); // lighter gray
        gradient.addColorStop(1, "#666666"); // darker gray
        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, canvas.height);
        const texture = new THREE.CanvasTexture(canvas);
        scene.background = texture;

        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
        camera.position.set(0, 1.6, 4.5);
        camera.lookAt(0, 1.55, 0);

        const renderer = new Renderer({ gl });
        renderer.setSize(w, h);

        // ✅ Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        const keyLight = new THREE.DirectionalLight("#FFFFFF", 0.8);
        keyLight.position.set(5, 5, 5);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight("#6794FF", 3);
        fillLight.position.set(-5, 2, 3);
        scene.add(fillLight);

        const backLight = new THREE.DirectionalLight("#FFB878", 6);
        backLight.position.set(0, 2, -5);
        scene.add(backLight);

        // ✅ Particle system
        const particleCount = 300;
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
          positions[i] = (Math.random() - 0.5) * 10;
        }
        particlesGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        const particlesMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.05,
          transparent: true,
          opacity: 0.8,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const particles = new THREE.Points(
          particlesGeometry,
          particlesMaterial
        );
        scene.add(particles);

        // ✅ Load GLB character
        const loader = new GLTFLoader();
        const url =
          modelUrl ||
          "https://readyplayerme-assets.s3.amazonaws.com/animations/visage/female.glb";
        loader.load(url, (gltf) => {
            const model = gltf.scene;
            model.scale.set(2, 2, 2);
            model.position.set(0, -0.2, 0);
            scene.add(model);

            mixer.current = new THREE.AnimationMixer(model);

            // ✅ Load animation
            const animLoader = new GLTFLoader();
            animLoader.load(
              "https://raw.githubusercontent.com/readyplayerme/animation-library/master/feminine/glb/idle/F_Standing_Idle_Variations_001.glb",
              (animGltf) => {
                if (animGltf.animations.length > 0 && mixer.current) {
                  const action = mixer.current.clipAction(
                    animGltf.animations[0]
                  );
                  action.play();
                }
              }
            );
          }
        );

        // ✅ Animation loop
        const animate = () => {
          frame.current = requestAnimationFrame(animate);
          const delta = clock.current.getDelta();

          if (mixer.current) {
            mixer.current.update(delta);
          }

          particles.rotation.y += delta * 0.1;

          renderer.render(scene, camera);
          gl.endFrameEXP();
        };
        animate();

        // ✅ Cleanup on unmount
        return () => {
          cancelAnimationFrame(frame.current);
          renderer.dispose();
          particlesGeometry.dispose();
          particlesMaterial.dispose();
          texture.dispose();
          gl = null;
        };
      }}
    />
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#f3f4f6" },
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
  glView: { width: width, height: height * 0.5 },
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

export {};
