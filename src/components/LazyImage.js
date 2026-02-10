import React, { useState, useRef, useEffect } from 'react';

/**
 * LazyImage component with native lazy loading, blur-up effect, and fallback
 * Supports both native loading="lazy" and IntersectionObserver fallback
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = null,
  width,
  height,
  style = {},
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Check if native lazy loading is supported
  const supportsNativeLazy = 'loading' in HTMLImageElement.prototype;

  useEffect(() => {
    // If native lazy loading isn't supported, use IntersectionObserver
    if (supportsNativeLazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [supportsNativeLazy]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  // Determine if we should load the image
  const shouldLoad = supportsNativeLazy || isInView;

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    width: width || '100%',
    height: height || 'auto',
    ...style,
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease, filter 0.3s ease',
    opacity: isLoaded ? 1 : 0,
    filter: isLoaded ? 'none' : 'blur(10px)',
  };

  const placeholderStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f0f 100%)',
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  };

  if (hasError) {
    return (
      <div style={containerStyle} className={className}>
        <div style={placeholderStyle}>
          <span style={{ color: '#666', fontSize: '0.875rem' }}>
            Failed to load image
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} style={containerStyle} className={className}>
      {/* Placeholder */}
      <div style={placeholderStyle}>
        {placeholder || (
          <div className="lazy-image-skeleton" style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #1a1a2e 25%, #2a2a4e 50%, #1a1a2e 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
        )}
      </div>

      {/* Actual Image */}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          loading={supportsNativeLazy ? 'lazy' : undefined}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
          {...props}
        />
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

/**
 * LazyVideo component with lazy loading and poster support
 */
export const LazyVideo = ({
  src,
  poster,
  className = '',
  autoPlay = false,
  muted = true,
  loop = true,
  playsInline = true,
  style = {},
  onLoad,
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);

        // Auto-pause when out of view for performance
        if (videoRef.current) {
          if (entry.isIntersecting && autoPlay) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [autoPlay]);

  const handleLoadedData = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  return (
    <div ref={containerRef} style={containerStyle} className={className}>
      {!isLoaded && poster && (
        <img
          src={poster}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {isInView && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          onLoadedData={handleLoadedData}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          {...props}
        />
      )}
    </div>
  );
};

/**
 * LazyIframe component with lazy loading
 */
export const LazyIframe = ({
  src,
  title,
  className = '',
  style = {},
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  // Check for native lazy loading support
  const supportsNativeLazy = 'loading' in HTMLIFrameElement.prototype;

  useEffect(() => {
    if (supportsNativeLazy || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [supportsNativeLazy]);

  const shouldLoad = supportsNativeLazy || isInView;

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  const placeholderStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a1a2e',
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  };

  return (
    <div ref={containerRef} style={containerStyle} className={className}>
      <div style={placeholderStyle}>
        <div style={{ color: '#666' }}>Loading...</div>
      </div>

      {shouldLoad && (
        <iframe
          src={src}
          title={title}
          loading={supportsNativeLazy ? 'lazy' : undefined}
          onLoad={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
