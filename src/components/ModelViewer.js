import React, { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function Model({ isMobile }) {
  const ref = useRef();
  const gltf = useLoader(GLTFLoader, '/model.glb');
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#000000',
          metalness: 1,
          roughness: 0.3,
          reflectivity: 1,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          emissive: new THREE.Color('#1a1a1a'),
          emissiveIntensity: 0.5,
          toneMapped: true,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);
  useFrame(() => {
    if (ref.current) {
      const rotationSpeed = hovered ? 0.003 : 0.005;
      ref.current.rotation.z += rotationSpeed;
    }
  });
  return (
    <primitive
      object={gltf.scene}
      ref={ref}
      scale={isMobile ? [2.2, 2.2, 2.2] : [4, 4, 4]}
      position={isMobile ? [1, 0.5, 0] : [2.5, 0.5, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

export default function ModelViewer() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <div className={isMobile ? 'model-mobile' : ''} style={{ width: '100vw', height: '100vh', background: 'transparent' }}>
      <Canvas camera={{ position: [0, 0, 13], fov: 30 }} shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <spotLight position={[4, 5, 3]} angle={0.4} intensity={4} penumbra={1} color="#ff66cc" castShadow />
          <directionalLight position={[-4, -2, -2]} intensity={2} color="#ff9900" />
          <Environment preset="sunset" />
          <Model isMobile={isMobile} />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}