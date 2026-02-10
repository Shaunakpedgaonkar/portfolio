import React, { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import './ModelViewer.css';

// Simple progress UI using drei's useProgress:
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="model-loader">Loading {Math.round(progress)}%</div>
    </Html>
  );
}

// Basic error boundary so GL/loader errors don't blank the whole page:
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('3D render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="model-error">
          <h3>Rendering Error</h3>
          <p>There was an issue rendering the 3D scene. Try reloading.</p>
          <pre>{String(this.state.error)}</pre>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrapper to handle OrbitControls with proper ref initialization
function SafeOrbitControls(props) {
  const controlsRef = useRef(null);
  return <OrbitControls ref={controlsRef} {...props} />;
}

function Model({ isMobile }) {
  const ref = useRef();
  const gltf = useLoader(GLTFLoader, '/model.glb'); // ensure /model.glb is in public/
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // store original materials so we can restore them and avoid accidental shared disposals
    const originalMaterials = new Map();
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        originalMaterials.set(child.uuid, child.material);
        const newMat = new THREE.MeshPhysicalMaterial({
          color: '#000000',
          metalness: 1,
          roughness: 0.3,
          reflectivity: 1,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          emissive: new THREE.Color('#1a1a1a'),
          emissiveIntensity: 0.5,
          toneMapped: true,
          // explicitly set vertexColors to avoid the THREE warning:
          vertexColors: child.material?.vertexColors ?? false,
        });
        child.material = newMat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return () => {
      // restore original materials and dispose the created ones
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          const created = child.material;
          const original = originalMaterials.get(child.uuid);
          if (created && created.dispose) created.dispose();
          if (original) child.material = original;
        }
      });
    };
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
      scale={isMobile ? [2.8, 2.8, 2.8] : [4, 4, 4]}
      position={isMobile ? [1.2, 0.3, 0] : [2.5, 0.5, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      dispose={null}
    />
  );
}

export default function ModelViewer() {
  const [isMobile, setIsMobile] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // attach webgl context loss handlers when canvas is created:
  const handleCanvasCreated = (state) => {
    const gl = state.gl;
    const canvas = gl.domElement;
    if (!canvas) return;

    const onLost = (e) => {
      e.preventDefault();
      console.warn('WebGL context lost');
      setContextLost(true);
    };
    const onRestore = () => {
      console.info('WebGL context restored');
      setContextLost(false);
    };
    canvas.addEventListener('webglcontextlost', onLost, false);
    canvas.addEventListener('webglcontextrestored', onRestore, false);
  };

  return (
    <div className="model-wrapper">
      {contextLost && (
        <div className="model-error-overlay">
          <div className="model-error-card">
            <h3>Rendering problem</h3>
            <p>We lost the WebGL context. Try reloading the page.</p>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => window.location.reload()}>Reload</button>
            </div>
          </div>
        </div>
      )}

      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 13], fov: 30 }}
          shadows
          onCreated={handleCanvasCreated}
          frameloop="always"
        >
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={0.2} />
            <spotLight position={[4, 5, 3]} angle={0.4} intensity={4} penumbra={1} color="#ff66cc" castShadow />
            <directionalLight position={[-4, -2, -2]} intensity={2} color="#ff9900" />
            {/* Environment for reflections only, no background */}
            <Environment preset="sunset" />
            <Model isMobile={isMobile} />
            <SafeOrbitControls enableZoom={false} enablePan={false} enableRotate={false} makeDefault />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
