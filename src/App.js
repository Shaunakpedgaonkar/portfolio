import React, { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import ModelViewer from './components/ModelViewer';
import ProjectsSection from './components/ProjectsSection';
import SocialIcons from './components/SocialIcons';
import ProjectShowcase from './components/ProjectShowcase';
import AvatarWithSkills from './components/AvatarWithSkills';
import ExperienceSection from './components/ExperienceSection';
import AboutMe from './components/AboutMe';
import Contact from './components/Contact';
import ScrollHint from './components/ScrollHint';
import './App.css';

function App() {
  const scrollRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = 6;

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const pageWidth = scrollContainer.clientWidth;
      const index = Math.round(scrollLeft / pageWidth);
      setPageIndex(index);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="horizontal-scroll-wrapper" ref={scrollRef}>
        <div className="scroll-page" id="home">
          <ModelViewer />
          <SocialIcons />
          <ProjectShowcase />
        </div>
        <div className="scroll-page" id="projects">
          <ProjectsSection />
        </div>
        <div className="scroll-page" id="skills">
          <AvatarWithSkills />
        </div>
        <div className="scroll-page" id="experience">
          <ExperienceSection />
        </div>
        <div className="scroll-page" id="about">
          <AboutMe />
        </div>
        <div className="scroll-page" id="contact" style={{ background: '#111' }}>
          <Contact />
        </div>
      </div>
      <ScrollHint currentPageIndex={pageIndex} totalPages={totalPages} />
    </>
  );
}

export default App;
