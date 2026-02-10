import React, { useEffect, useRef, useState, lazy, Suspense, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProjectShowcase from './components/ProjectShowcase';
import ScrollHint from './components/ScrollHint';
import Preloader from './components/Preloader';
import { useDeviceCapabilities } from './hooks/useDeviceCapabilities';
import './App.css';
import './styles/responsive.css';

// Lazy-loaded components with prefetch hints
const ModelViewer = lazy(() => import('./components/ModelViewer'));
const SocialIcons = lazy(() => import('./components/SocialIcons'));
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const AvatarWithSkills = lazy(() => import('./components/AvatarWithSkills'));
const ExperienceSection = lazy(() => import('./components/ExperienceSection'));
const AboutMe = lazy(() => import('./components/AboutMe'));
const Contact = lazy(() => import('./components/Contact'));

// Fallback component for 3D elements on low-end devices
const Model3DFallback = ({ message = "3D View" }) => (
  <div className="model-fallback">
    <div className="fallback-content">
      <div className="fallback-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <p>{message}</p>
    </div>
  </div>
);

// Section loader component
const SectionLoader = ({ section }) => (
  <div className="section-loader">
    <div className="section-loader-spinner" />
    <span>Loading {section}...</span>
  </div>
);

function App() {
  const scrollRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleSections, setVisibleSections] = useState(new Set([0]));
  const totalPages = 6;

  // Get device capabilities for performance optimization
  const {
    isLowEnd,
    hasWebGL,
    isReducedMotion,
    qualitySettings
  } = useDeviceCapabilities();

  // Handle preloader completion
  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
    // Remove preloader from DOM after animation
    document.body.classList.add('loaded');
  }, []);

  // Scroll handler with debouncing for performance
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollLeft = scrollContainer.scrollLeft;
          const pageWidth = scrollContainer.clientWidth;
          const index = Math.round(scrollLeft / pageWidth);

          setPageIndex(index);

          // Track visible sections for lazy loading
          const visibleRange = new Set();
          for (let i = Math.max(0, index - 1); i <= Math.min(totalPages - 1, index + 1); i++) {
            visibleRange.add(i);
          }
          setVisibleSections(prev => {
            const newSet = new Set([...prev, ...visibleRange]);
            return newSet;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [totalPages]);

  // Preload next section when approaching
  useEffect(() => {
    const preloadSection = (index) => {
      if (index >= 0 && index < totalPages) {
        setVisibleSections(prev => new Set([...prev, index]));
      }
    };

    // Preload adjacent sections
    preloadSection(pageIndex - 1);
    preloadSection(pageIndex + 1);
  }, [pageIndex, totalPages]);

  // Prevent body scroll during loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  // Determine if we should show 3D content
  const show3D = hasWebGL && qualitySettings.enable3D && !isReducedMotion;

  return (
    <>
      {/* Preloader */}
      {isLoading && <Preloader onLoadComplete={handleLoadComplete} />}

      {/* Main Content */}
      <div className={`app-content ${isLoading ? 'loading' : 'loaded'}`}>
        <Navbar />

        <div className="horizontal-scroll-wrapper" ref={scrollRef}>
          {/* Home Section */}
          <div className="scroll-page" id="home">
            {show3D ? (
              <Suspense fallback={<SectionLoader section="3D Model" />}>
                <ModelViewer qualitySettings={qualitySettings} />
              </Suspense>
            ) : (
              <Model3DFallback message="Interactive 3D Portfolio" />
            )}

            <ProjectShowcase />
          </div>

          {/* Projects Section */}
          <div className="scroll-page" id="projects">
            {visibleSections.has(1) ? (
              <Suspense fallback={<SectionLoader section="Projects" />}>
                <ProjectsSection isLowEnd={isLowEnd} />
              </Suspense>
            ) : (
              <SectionLoader section="Projects" />
            )}
          </div>

          {/* Skills Section */}
          <div className="scroll-page" id="skills">
            {visibleSections.has(2) ? (
              <Suspense fallback={<SectionLoader section="Skills" />}>
                {show3D ? (
                  <AvatarWithSkills qualitySettings={qualitySettings} />
                ) : (
                  <AvatarWithSkills qualitySettings={{ ...qualitySettings, enable3D: false }} />
                )}
              </Suspense>
            ) : (
              <SectionLoader section="Skills" />
            )}
          </div>

          {/* Experience Section */}
          <div className="scroll-page" id="experience">
            {visibleSections.has(3) ? (
              <Suspense fallback={<SectionLoader section="Experience" />}>
                <ExperienceSection />
              </Suspense>
            ) : (
              <SectionLoader section="Experience" />
            )}
          </div>

          {/* About Section */}
          <div className="scroll-page" id="about">
            {visibleSections.has(4) ? (
              <Suspense fallback={<SectionLoader section="About" />}>
                <AboutMe isReducedMotion={isReducedMotion} />
              </Suspense>
            ) : (
              <SectionLoader section="About" />
            )}
          </div>

          {/* Contact Section */}
          <div className="scroll-page" id="contact">
            {visibleSections.has(5) ? (
              <Suspense fallback={<SectionLoader section="Contact" />}>
                <Contact isLowEnd={isLowEnd} />
              </Suspense>
            ) : (
              <SectionLoader section="Contact" />
            )}
          </div>
        </div>

        <ScrollHint currentPageIndex={pageIndex} totalPages={totalPages} />

        {/* Social icons fixed globally, hidden on experience page */}
        <Suspense fallback={null}>
          <SocialIcons pageIndex={pageIndex} />
        </Suspense>
      </div>
    </>
  );
}

export default App;
