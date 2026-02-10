import React, { useEffect, useState, useCallback, useRef } from 'react';
import './Preloader.css';

// Critical assets to preload before showing the site
const PRELOAD_ASSETS = [
  { url: '/model.glb', weight: 70 },   // Main 3D model (~8.6MB)
  { url: '/avatar.glb', weight: 30 },  // Skills avatar
];

function loadAsset(url, onProgress) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(event.loaded / event.total);
      }
    };

    xhr.onload = () => {
      onProgress(1);
      resolve();
    };

    xhr.onerror = () => {
      // Don't block the preloader on network errors
      onProgress(1);
      resolve();
    };

    xhr.send();
  });
}

const Preloader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const progressMap = useRef({});

  const recalculateProgress = useCallback(() => {
    const totalWeight = PRELOAD_ASSETS.reduce((sum, a) => sum + a.weight, 0);
    let weighted = 0;
    PRELOAD_ASSETS.forEach((asset) => {
      const assetProgress = progressMap.current[asset.url] || 0;
      weighted += assetProgress * (asset.weight / totalWeight);
    });
    setProgress(Math.round(weighted * 100));
  }, []);

  useEffect(() => {
    // Initialize progress map
    PRELOAD_ASSETS.forEach((asset) => {
      progressMap.current[asset.url] = 0;
    });

    // Start loading all assets in parallel with byte-level progress
    const assetPromises = PRELOAD_ASSETS.map((asset) =>
      loadAsset(asset.url, (fraction) => {
        progressMap.current[asset.url] = fraction;
        recalculateProgress();
      })
    );

    // Also wait for the document to be fully ready
    const docReady = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve, { once: true });
      }
    });

    Promise.all([...assetPromises, docReady]).then(() => {
      setProgress(100);
    });
  }, [recalculateProgress]);

  useEffect(() => {
    if (progress >= 100) {
      // Small delay before fade out for smooth transition
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 300);

      const completeTimer = setTimeout(() => {
        onLoadComplete?.();
      }, 800);

      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, onLoadComplete]);

  return (
    <div className={`preloader ${fadeOut ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        {/* Animated Logo/Brand */}
        <div className="preloader-logo">
          <div className="logo-cube">
            <div className="cube-face front"></div>
            <div className="cube-face back"></div>
            <div className="cube-face right"></div>
            <div className="cube-face left"></div>
            <div className="cube-face top"></div>
            <div className="cube-face bottom"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="preloader-text">
          <span className="loading-letter" style={{ animationDelay: '0s' }}>L</span>
          <span className="loading-letter" style={{ animationDelay: '0.1s' }}>o</span>
          <span className="loading-letter" style={{ animationDelay: '0.2s' }}>a</span>
          <span className="loading-letter" style={{ animationDelay: '0.3s' }}>d</span>
          <span className="loading-letter" style={{ animationDelay: '0.4s' }}>i</span>
          <span className="loading-letter" style={{ animationDelay: '0.5s' }}>n</span>
          <span className="loading-letter" style={{ animationDelay: '0.6s' }}>g</span>
        </div>

        {/* Progress Bar */}
        <div className="preloader-progress">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>

        {/* Floating Particles */}
        <div className="preloader-particles">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                '--delay': `${i * 0.2}s`,
                '--x': `${Math.random() * 100}%`,
                '--duration': `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
