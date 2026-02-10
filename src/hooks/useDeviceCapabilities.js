import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook for detecting device capabilities and optimizing 3D/performance settings
 * Returns device type, GPU capabilities, and recommended quality settings
 */
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLowEnd: false,
    hasWebGL: true,
    hasWebGL2: false,
    gpuTier: 'high', // 'low', 'medium', 'high'
    devicePixelRatio: 1,
    hardwareConcurrency: 4,
    deviceMemory: 8,
    isReducedMotion: false,
    isTouchDevice: false,
    screenSize: 'desktop', // 'mobile', 'tablet', 'desktop', 'large', '4k'
    connectionType: 'unknown',
    isSlowConnection: false,
  });

  useEffect(() => {
    const detectCapabilities = () => {
      // Device type detection
      const width = window.innerWidth;
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1024;
      const isDesktop = width > 1024;

      // Screen size classification
      let screenSize = 'desktop';
      if (width <= 480) screenSize = 'mobile-small';
      else if (width <= 768) screenSize = 'mobile';
      else if (width <= 1024) screenSize = 'tablet';
      else if (width <= 1440) screenSize = 'desktop';
      else if (width <= 2560) screenSize = 'large';
      else screenSize = '4k';

      // Touch detection
      const isTouchDevice = 'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;

      // Reduced motion preference
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Hardware capabilities
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = navigator.deviceMemory || 4;

      // WebGL detection
      let hasWebGL = false;
      let hasWebGL2 = false;
      let gpuInfo = null;

      try {
        const canvas = document.createElement('canvas');
        const gl2 = canvas.getContext('webgl2');
        const gl = gl2 || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        hasWebGL = !!gl;
        hasWebGL2 = !!gl2;

        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            gpuInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        }
      } catch (e) {
        hasWebGL = false;
      }

      // GPU tier estimation based on various factors
      let gpuTier = 'high';
      const isLowEndGPU = gpuInfo && (
        /intel|hd graphics|uhd graphics|integrated/i.test(gpuInfo) ||
        /mali-4|mali-t|adreno 3|adreno 4|powervr/i.test(gpuInfo)
      );

      if (!hasWebGL) {
        gpuTier = 'low';
      } else if (isMobile || isLowEndGPU || deviceMemory < 4 || hardwareConcurrency < 4) {
        gpuTier = 'low';
      } else if (isTablet || deviceMemory < 8 || hardwareConcurrency < 8) {
        gpuTier = 'medium';
      }

      // Connection type detection
      let connectionType = 'unknown';
      let isSlowConnection = false;
      if (navigator.connection) {
        connectionType = navigator.connection.effectiveType || 'unknown';
        isSlowConnection = ['slow-2g', '2g', '3g'].includes(connectionType);
      }

      // Low-end device detection
      const isLowEnd = gpuTier === 'low' ||
        deviceMemory < 4 ||
        hardwareConcurrency < 4 ||
        isSlowConnection ||
        !hasWebGL;

      setCapabilities({
        isMobile,
        isTablet,
        isDesktop,
        isLowEnd,
        hasWebGL,
        hasWebGL2,
        gpuTier,
        devicePixelRatio,
        hardwareConcurrency,
        deviceMemory,
        isReducedMotion,
        isTouchDevice,
        screenSize,
        connectionType,
        isSlowConnection,
      });
    };

    detectCapabilities();

    // Re-detect on resize
    const handleResize = () => {
      requestAnimationFrame(detectCapabilities);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Memoized quality settings based on capabilities
  const qualitySettings = useMemo(() => {
    const { gpuTier, isMobile, isReducedMotion, devicePixelRatio } = capabilities;

    if (!capabilities.hasWebGL) {
      return {
        enable3D: false,
        shadows: false,
        postProcessing: false,
        antialias: false,
        pixelRatio: 1,
        modelScale: 0,
        animationQuality: 'none',
        particleCount: 0,
        textureQuality: 'low',
      };
    }

    if (gpuTier === 'low' || isReducedMotion) {
      return {
        enable3D: true,
        shadows: false,
        postProcessing: false,
        antialias: false,
        pixelRatio: Math.min(devicePixelRatio, 1),
        modelScale: isMobile ? 1.5 : 2.5,
        animationQuality: 'low',
        particleCount: 4,
        textureQuality: 'low',
      };
    }

    if (gpuTier === 'medium') {
      return {
        enable3D: true,
        shadows: true,
        postProcessing: false,
        antialias: true,
        pixelRatio: Math.min(devicePixelRatio, 1.5),
        modelScale: isMobile ? 2 : 3,
        animationQuality: 'medium',
        particleCount: 8,
        textureQuality: 'medium',
      };
    }

    // High tier
    return {
      enable3D: true,
      shadows: true,
      postProcessing: true,
      antialias: true,
      pixelRatio: Math.min(devicePixelRatio, 2),
      modelScale: isMobile ? 2.2 : 4,
      animationQuality: 'high',
      particleCount: 12,
      textureQuality: 'high',
    };
  }, [capabilities]);

  return { ...capabilities, qualitySettings };
}

/**
 * Hook for lazy loading components when they come into view
 */
export function useLazyLoad(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [ref, setRef] = useState(null);

  const { threshold = 0.1, rootMargin = '100px', triggerOnce = true } = options;

  useEffect(() => {
    if (!ref) return;

    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      setHasLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasLoaded(true);
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, triggerOnce]);

  return { ref: setRef, isVisible, hasLoaded };
}

/**
 * Hook for preloading critical assets
 */
export function useAssetPreloader(assets = []) {
  const [loadingState, setLoadingState] = useState({
    loaded: 0,
    total: assets.length,
    progress: 0,
    isComplete: false,
    errors: [],
  });

  useEffect(() => {
    if (assets.length === 0) {
      setLoadingState(prev => ({ ...prev, isComplete: true, progress: 100 }));
      return;
    }

    let loadedCount = 0;
    const errors = [];

    const updateProgress = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / assets.length) * 100);
      setLoadingState({
        loaded: loadedCount,
        total: assets.length,
        progress,
        isComplete: loadedCount >= assets.length,
        errors,
      });
    };

    const handleError = (asset, error) => {
      errors.push({ asset, error });
      updateProgress();
    };

    assets.forEach(asset => {
      if (typeof asset === 'string') {
        // Determine asset type by extension
        const ext = asset.split('.').pop()?.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
          const img = new Image();
          img.onload = updateProgress;
          img.onerror = () => handleError(asset, 'Image load failed');
          img.src = asset;
        } else if (['glb', 'gltf'].includes(ext)) {
          // For 3D models, just do a HEAD request to warm cache
          fetch(asset, { method: 'HEAD' })
            .then(updateProgress)
            .catch(() => handleError(asset, 'Model fetch failed'));
        } else {
          // Generic fetch for other assets
          fetch(asset, { method: 'HEAD' })
            .then(updateProgress)
            .catch(() => handleError(asset, 'Asset fetch failed'));
        }
      }
    });
  }, [assets]);

  return loadingState;
}

export default useDeviceCapabilities;
