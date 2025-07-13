import React, { useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

export type GLBModelViewerProps = { modelUrl: string };

export default function GLBModelViewer({ modelUrl }: GLBModelViewerProps) {
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
      key={modelUrl}
      style={styles.glView}
      onContextCreate={async (gl) => {
        const { drawingBufferWidth: w, drawingBufferHeight: h } = gl;

        const scene = new THREE.Scene();

        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 256;
        const context = canvas.getContext("2d");
        const gradient = context!.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#Ffff00");
        gradient.addColorStop(1, "#666666");
        context!.fillStyle = gradient;
        context!.fillRect(0, 0, 1, canvas.height);
        const texture = new THREE.CanvasTexture(canvas);
        scene.background = texture;

        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
        camera.position.set(0, 1.6, 4.5);
        camera.lookAt(0, 1.55, 0);

        const renderer = new Renderer({ gl });
        renderer.setSize(w, h);

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

        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => {
          const model = gltf.scene;
          model.scale.set(2, 2, 2);
          model.position.set(0, -0.2, 0);
          scene.add(model);

          mixer.current = new THREE.AnimationMixer(model);

          const animLoader = new GLTFLoader();
          animLoader.load(
            "https://raw.githubusercontent.com/readyplayerme/animation-library/master/feminine/glb/idle/F_Standing_Idle_Variations_001.glb",
            (animGltf) => {
              if (animGltf.animations.length > 0 && mixer.current) {
                const action = mixer.current.clipAction(animGltf.animations[0]);
                action.play();
              }
            }
          );
        });

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

        return () => {
          cancelAnimationFrame(frame.current!);
          renderer.dispose();
          particlesGeometry.dispose();
          particlesMaterial.dispose();
          texture.dispose();
          // @ts-ignore
          gl = null;
        };
      }}
    />
  );
}

const styles = StyleSheet.create({
  glView: { width: "100%", height: 400 },
});
