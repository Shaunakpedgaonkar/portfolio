import React from 'react';
import './ProjectShowcase.css';

export default function ProjectShowcase() {
  return (
    <div className="project-showcase-container no-card-landing">
      <h1>Hey, I’m Shaunak</h1>

      {/* Desktop version */}
      <p className="desktop-only">
        A curious CS postgrad passionate about building scalable apps, smart systems, and meaningful tech.
        <br /><br />
        I build full-stack apps, design resilient cloud systems, and explore AI/ML to solve real-world problems.
      </p>

      {/* Mobile version */}
      <p className="mobile-only">
        I'm Shaunak, a Computer Science graduate from Trinity College Dublin.  
        I design scalable cloud systems, full-stack apps, and ML tools that solve real-world problems.

      </p>
    </div>
  );
}
