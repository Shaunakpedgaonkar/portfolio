import React from 'react';
import './ProjectShowcase.css';

export default function ProjectShowcase() {
  return (
    <div className="project-showcase-container no-card-landing">
      <h1>Hey, I’m Shaunak</h1>

      {/* Desktop version */}
      <p className="desktop-only">
       Computer Science postgraduate from Trinity College Dublin, passionate about building scalable applications, intelligent systems, and technology that makes a difference.
        <br /><br />
        I build full-stack apps, Intruiged in designing scalable system , and exploring AI/ML to solve real-world problems.
      </p>

      {/* Mobile version */}
      <p className="mobile-only">
        Computer Science postgraduate from Trinity College Dublin.
        I build scalable cloud systems, full-stack applications, and intelligent tools that solve real-world problems.
      </p>
    </div>
  );
}
