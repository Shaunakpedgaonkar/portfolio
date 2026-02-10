// AvatarWithSkills.js
import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, useAnimations } from "@react-three/drei";
import { useInView } from "react-intersection-observer";
import "./AvatarWithSkills.css";

// Wrapper to handle OrbitControls with proper ref initialization
function SafeOrbitControls(props) {
  const controlsRef = useRef(null);
  return <OrbitControls ref={controlsRef} {...props} />;
}

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
function SkillsConsole({ isReducedMotion }) {
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
    // If reduced motion, show all text immediately
    if (isReducedMotion) {
      setDisplayedText(fullText);
      setIndex(fullText.length);
      return;
    }

    if (inView && index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText.charAt(index));
        setIndex(index + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [inView, index, fullText, isReducedMotion]);

  return (
    <div ref={ref} className="skills-console">
      <div className="skills-console-header">{"> skills"}</div>
      <div className="skills-console-text">{displayedText}</div>
      <span className="skills-console-cursor" />
    </div>
  );
}

// 3D Fallback for low-end devices
function Avatar3DFallback() {
  return (
    <div className="avatar-fallback">
      <div className="avatar-fallback-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" />
        </svg>
      </div>
      <p>3D Avatar</p>
    </div>
  );
}

// Final Combined Layout Component
export default function AvatarWithSkills({ qualitySettings = {} }) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkReducedMotion = () => {
      setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkReducedMotion();
    checkMobile();

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', checkReducedMotion);
    window.addEventListener('resize', checkMobile);

    return () => {
      motionQuery.removeEventListener('change', checkReducedMotion);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const show3D = qualitySettings.enable3D !== false;

  return (
    <div className="avatar-skills-container">
      {/* Left: 3D Avatar */}
      <div className="avatar-section">
        {show3D ? (
          <Canvas camera={{ position: [0, 1.4, 4], fov: 35 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[2, 6, 4]} intensity={1.2} />
            <Suspense fallback={null}>
              <AvatarModel />
              <Environment preset="city" />
              <SafeOrbitControls enablePan={false} enableZoom={false} enableRotate={!isMobile} makeDefault />
            </Suspense>
          </Canvas>
        ) : (
          <Avatar3DFallback />
        )}
      </div>

      {/* Right: Terminal-style Skills */}
      <SkillsConsole isReducedMotion={isReducedMotion} />
    </div>
  );
}
