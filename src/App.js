import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import ModelViewer from './components/ModelViewer';
import ProjectShowcase from './components/ProjectShowcase';
import ScrollHint from './components/ScrollHint';
import './App.css';

// Lazy-loaded components
const SocialIcons = lazy(() => import('./components/SocialIcons'));
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const AvatarWithSkills = lazy(() => import('./components/AvatarWithSkills'));
const ExperienceSection = lazy(() => import('./components/ExperienceSection'));
const AboutMe = lazy(() => import('./components/AboutMe'));
const Contact = lazy(() => import('./components/Contact'));

function App() {
  const scrollRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = 6;

  // Add this in your main component (e.g. App.js or HomePage.js)
useEffect(() => {
  const container = document.querySelector('.horizontal-scroll-wrapper');
  let isDown = false;
  let startX;
  let scrollLeft;

  const start = (e) => {
    isDown = true;
    startX = e.pageX || e.touches[0].pageX;
    scrollLeft = container.scrollLeft;
  };

  const move = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    const walk = (startX - x);
    container.scrollLeft = scrollLeft + walk;
  };

  const end = () => isDown = false;

  container.addEventListener('mousedown', start);
  container.addEventListener('mousemove', move);
  container.addEventListener('mouseup', end);
  container.addEventListener('mouseleave', end);
  container.addEventListener('touchstart', start);
  container.addEventListener('touchmove', move);
  container.addEventListener('touchend', end);

  return () => {
    container.removeEventListener('mousedown', start);
    container.removeEventListener('mousemove', move);
    container.removeEventListener('mouseup', end);
    container.removeEventListener('mouseleave', end);
    container.removeEventListener('touchstart', start);
    container.removeEventListener('touchmove', move);
    container.removeEventListener('touchend', end);
  };
}, []);


  return (
    <>
      <Navbar />
      <div className="horizontal-scroll-wrapper" ref={scrollRef}>
        <div className="scroll-page" id="home">
          <ModelViewer />
          <Suspense fallback={<div className="loader">Loading Social Icons...</div>}>
            <SocialIcons />
          </Suspense>
          <ProjectShowcase />
        </div>

        <Suspense fallback={<div className="loader">Loading Projects...</div>}>
          <div className="scroll-page" id="projects">
            <ProjectsSection />
          </div>
        </Suspense>

        <Suspense fallback={<div className="loader">Loading Skills...</div>}>
          <div className="scroll-page" id="skills">
            <AvatarWithSkills />
          </div>
        </Suspense>

        <Suspense fallback={<div className="loader">Loading Experience...</div>}>
          <div className="scroll-page" id="experience">
            <ExperienceSection />
          </div>
        </Suspense>

        <Suspense fallback={<div className="loader">Loading About Me...</div>}>
          <div className="scroll-page" id="about">
            <AboutMe />
          </div>
        </Suspense>

        <Suspense fallback={<div className="loader">Loading Contact...</div>}>
          <div className="scroll-page" id="contact" style={{ background: '#111' }}>
            <Contact />
          </div>
        </Suspense>
      </div>
      <ScrollHint currentPageIndex={pageIndex} totalPages={totalPages} />
    </>
  );
}

export default App;
