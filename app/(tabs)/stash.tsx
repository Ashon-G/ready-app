import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import BottomDrawer from "../../components/BottomDrawer";
import LootCard from "../../components/LootCard";
import { lootItems } from "../constants/lootData";

const { width } = Dimensions.get("window");

export default function StashScreen() {
  const [drawerOpen, setDrawerOpen] = useState(true); // ✅ control drawer state

  return (
    <SafeAreaView style={styles.safeContainer}>
   
        <View style={styles.mainWrapper}>
          <View style={styles.centerColumn}>
            <GLBModelViewer />
            <BottomDrawer
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <ScrollView>
                {lootItems.map((item, index) => (
                  <View key={index} style={{ marginBottom: 16 }}>
                    <LootCard {...item} />
                  </View>
                ))}
                <TouchableOpacity onPress={() => setDrawerOpen(false)}>
                  <Text style={{ color: "blue", marginTop: 10 }}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </BottomDrawer>
          </View>
        </View>
  
    </SafeAreaView>
  );
}

function GLBModelViewer() {
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
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color("rgb(9,20,26)");

        const camera = new THREE.PerspectiveCamera(
          50,
          width / height,
          0.1,
          1000
        );
        camera.position.set(0, 1.6, 4.5); // further back
        camera.lookAt(0, 1.55, 0);

        const renderer = new (Renderer as any)({ gl }) as THREE.WebGLRenderer;
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);

        // Lights
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

        const loader = new GLTFLoader();
        loader.load(
          "https://readyplayerme-assets.s3.amazonaws.com/animations/visage/female.glb",
          (gltf) => {
            console.log("GLB loaded:", gltf);
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, 1, 0); // lower it
            model.rotation.y = 0;
            scene.add(model);

            mixer.current = new THREE.AnimationMixer(model);

            const animLoader = new GLTFLoader();
            animLoader.load(
              "https://raw.githubusercontent.com/readyplayerme/animation-library/master/feminine/glb/idle/F_Standing_Idle_Variations_001.glb",
              (animGltf) => {
                if (animGltf.animations && animGltf.animations.length > 0 && mixer.current) {
                  const action = mixer.current.clipAction(animGltf.animations[0]);
                  action.play();
                }
              },
              undefined,
              (animError) => {
                console.error("Animation load error:", animError);
              }
            );
          },
          (progress) => {
            console.log(
              "GLB loading progress:",
              progress.loaded / progress.total
            );
          },
          (error) => {
            console.error("GLB load error:", error);
          }
        );

        const animate = () => {
          frame.current = requestAnimationFrame(animate);
          const delta = clock.current.getDelta();
          if (mixer.current) {
            mixer.current.update(delta);
          }
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };
        animate();
      }}
    />
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flex: 1 },
  centerColumn: { alignItems: "center" },
  innerBox: { backgroundColor: "#fff" },
  bgPanelImage: { height: 400 },
  panelBackgroundOverlay: {
    position: "absolute",
    bottom: 0,
    right: 40,
    left: 40,
    height: 302,
    backgroundColor: "#FFFFFF4D",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomPanel: {
    position: "absolute",
    bottom: 1,
    right: 11,
    left: 11,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  
  largeCardButton: {
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 17,
    marginRight: 10,
  },
  cardImage: { width: 74, height: 74 },
  cardRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  rowIcon: { width: 20, height: 20, marginRight: 5 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingIcon: { width: 20, height: 20, marginRight: 4 },
  ratingText: { fontSize: 14, marginRight: 4 },
  ratingBar: {
    width: 8,
    height: 20,
    backgroundColor: "#00000080",
    marginRight: 4,
  },
  cardText: { fontSize: 14 },

  characterOverlay: {
    position: "absolute",

    right: 64,
    left: 64,
    height: 258,
  },
  glView: {
    width: width,
    height: Dimensions.get("window").height * 0.6,
  },
});
