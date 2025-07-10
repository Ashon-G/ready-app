import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import BottomDrawer from '../../components/BottomDrawer';
import LootCard from '../../components/LootCard';
import { lootItems } from '../constants/lootData';

const { width, height } = Dimensions.get('window');

const DEFAULT_USER = {
  username: '@Ashon',
  coins: '1,155',
  rank: '#138871',
};

export default function StashScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user] = useState(DEFAULT_USER);
  const [mainButtonLabel] = useState('SAKU BATTLES');
  const [newBadgeLabel] = useState('NEW');
  const [detailsLabel] = useState('Details');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Header coins={user.coins} />
        <View style={styles.detailsRow}>
          <View style={styles.avatarRow}>
            <Image
              source={{
                uri:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBak5aHgqR_B9odfm1jIehKDYNzyvFBfb48rHF-46hQRuPE7AvUarl-d2XwMC5C3m_3EwJgiT2vsNwoFOQ32sqBO_04aIwsg13yzoWNNs6bLYu5xLtiOIAZEQ862qMKwXDOphauSD3mGeQ0q-Y2tVfhHmUd_EsHqEUvG4S3_MSPCOrU9-VpokgOiaKK_BYI6nwA4syqynWSOJVl9tXuYF-LGybc0pbpkdxSRubhSjir2tZnM86A4OaIhPUzAmAbdJfkO8YpqMjWiokr',
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
          <GLBModelViewer />
        </View>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
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
            source={{
              uri:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBKGhJk-lI1adEpgVbBzJZVnCqiznx1j5NA5soAwcbT4DkTQqm6PE5XuXFoicIxiJiHBVfeGTFdl5fSul9qFG9vSZ0tuXfCeOwc68e7LUDJVc3YNKoEY52oEgBca6p4FOLg1pNuWqfz-jKUtalr3IyEItk6ff6_CYkaCHCGDZhVB9abfSKrhWS6ZTPiYXgZng_3rKdWMxcDw1wpyUXip4fsvU2HZ29owtLd_9u7EFH5Dxph_zh_JJwrv9kcKK4xc0HIbf50mHNh52Re',
            }}
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
        const { drawingBufferWidth: w, drawingBufferHeight: h } = gl;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('rgb(9,20,26)');

        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
        camera.position.set(0, 1.6, 4.5);
        camera.lookAt(0, 1.55, 0);

        const renderer = new (Renderer as any)({ gl }) as THREE.WebGLRenderer;
        renderer.setSize(w, h);
        renderer.setClearColor(0x000000, 0);

        scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        const keyLight = new THREE.DirectionalLight('#FFFFFF', 0.8);
        keyLight.position.set(5, 5, 5);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight('#6794FF', 3);
        fillLight.position.set(-5, 2, 3);
        scene.add(fillLight);

        const backLight = new THREE.DirectionalLight('#FFB878', 6);
        backLight.position.set(0, 2, -5);
        scene.add(backLight);

        const loader = new GLTFLoader();
        loader.load(
          'https://readyplayerme-assets.s3.amazonaws.com/animations/visage/female.glb',
          (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, 1, 0);
            model.rotation.y = 0;
            scene.add(model);

            mixer.current = new THREE.AnimationMixer(model);

            const animLoader = new GLTFLoader();
            animLoader.load(
              'https://raw.githubusercontent.com/readyplayerme/animation-library/master/feminine/glb/idle/F_Standing_Idle_Variations_001.glb',
              (animGltf) => {
                if (animGltf.animations && animGltf.animations.length > 0 && mixer.current) {
                  const action = mixer.current.clipAction(animGltf.animations[0]);
                  action.play();
                }
              }
            );
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
  safeContainer: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#3b82f6', padding: 16 },
  headerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  iconButton: { padding: 4 },
  coinsContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 4 },
  coinImage: { width: 32, height: 32, marginRight: 4 },
  coinText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingHorizontal: 16 },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarPlaceholder: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e5e7eb', marginLeft: 8 },
  detailsButton: { backgroundColor: '#f97316', borderRadius: 9999, paddingVertical: 8, paddingHorizontal: 16 },
  detailsButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  modelWrapper: { alignItems: 'center', marginTop: 16 },
  glView: { width: width, height: height * 0.5 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db', marginHorizontal: 2 },
  userRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 16 },
  username: { fontSize: 16, fontWeight: '600' },
  mainButton: { backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16 },
  mainButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  newBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: '#10b981', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  newBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  rankCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 16, marginTop: 16 },
  rankLeft: { flexDirection: 'row', alignItems: 'center' },
  rankIcon: { backgroundColor: '#e5e7eb', borderRadius: 9999, padding: 8, marginRight: 8 },
  rankNumber: { color: '#3b82f6', fontSize: 20, fontWeight: 'bold' },
  rankLabel: { fontSize: 12, color: '#6b7280' },
  rankRight: { alignItems: 'flex-end' },
  rankCoins: { color: '#f97316', fontSize: 20, fontWeight: 'bold' },
});

export {};

