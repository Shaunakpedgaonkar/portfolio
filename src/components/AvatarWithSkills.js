// AvatarWithSkills.js
import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, useAnimations } from "@react-three/drei";
import { useInView } from "react-intersection-observer";

// Avatar Loader with Looping Animation
function AvatarModel() {
  const { scene, animations } = useGLTF("/avatar.glb");
  const avatarRef = useRef();
  const { actions } = useAnimations(animations, avatarRef);

  useEffect(() => {
    let timeout;

    const playAndPauseAnimation = () => {
      if (actions && animations.length > 0) {
        const anim = actions[animations[0].name];
        anim.reset().play();

        timeout = setTimeout(() => {
          anim.paused = true;
          timeout = setTimeout(() => {
            anim.reset().play();
            anim.paused = false;
            playAndPauseAnimation(); // loop
          }, 5000); // 5s pause
        }, anim.getClip().duration * 1000);
      }
    };

    playAndPauseAnimation();
    return () => clearTimeout(timeout);
  }, [actions, animations]);

  return (
    <primitive
      object={scene}
      ref={avatarRef}
      scale={1.4}
      position={[0, -1.5, 0]}
    />
  );
}

// Terminal Console with Typing Animation Triggered on Scroll
function SkillsConsole() {
  const fullText = `Languages: Java, Python, C/C++, JavaScript, SQL, HTML/CSS
Frameworks: React, Node.js, Flask, WordPress, Django
Databases:  MySQL, MongoDB, AWS (EC2, S3, RDS, Route 53), Docker`;


  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (inView && index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText.charAt(index));
        setIndex(index + 1);
      }, 30); // ← Slow this down by increasing the value (e.g., 50 or 80)
      return () => clearTimeout(timeout);
    }
  }, [inView, index, fullText]);

  return (
    <div
      ref={ref}
      style={{
        background: "#111",
        color: "#00ff00",
        fontFamily: "'Fira Code', 'Courier New', monospace",
        padding: "24px 32px",
        borderRadius: 12,
        width: "420px",
        minHeight: "320px",
        boxShadow: "0 0 16px #00ff0033",
        fontSize: "16px",
        lineHeight: "1.7",
        whiteSpace: "pre-line",
        overflowY: "auto",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 16 }}>{"> show skills"}</div>
      <div>{displayedText}</div>
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 20,
          background: "#00ff00",
          marginTop: 8,
          animation: "blink 1s step-start 0s infinite",
        }}
      />
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

// Final Combined Layout Component
export default function AvatarWithSkills() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vh",
        background: "#18191a",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Orbitron, 'Segoe UI', Arial, sans-serif",
        overflow: "hidden",
        padding: "2vh",
      }}
    >
      {/* Left: 3D Avatar */}
      <div
        style={{
          width: "45vw",
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at center, #333 50%, transparent 100%)",
          borderRadius: 24,
          boxShadow: "0 0 32px #000a",
          marginRight: "3vw",
        }}
      >
        <Canvas camera={{ position: [0, 1.4, 4], fov: 35 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 6, 4]} intensity={1.2} />
          <Suspense fallback={null}>
            <AvatarModel />
            <Environment preset="city" />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Suspense>
        </Canvas>
      </div>

      {/* Right: Terminal-style Skills */}
      <SkillsConsole />
    </div>
  );
}
