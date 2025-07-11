// ... existing code ...
import React, { useEffect, useRef } from 'react';
import './AboutMe.css';

const AboutMe = () => {
  const sectionRef = useRef();

  useEffect(() => {
    // Scroll-triggered highlight for text reveal
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (sectionRef.current) {
          if (entry.isIntersecting) {
            sectionRef.current.classList.add('active');
          } else {
            sectionRef.current.classList.remove('active');
          }
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-me" ref={sectionRef}>
      <div className="floating-cubes">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            className={`cube cube-${i + 1}`}
            key={i}
            style={{ left: `${10 + i * 10}%` }}
          />
        ))}
      </div>
      <div className="animated-mini-cubes">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className={`mini-cube mini-cube-${i + 1}`} key={i} />
        ))}
      </div>
      <div className="animated-lines">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className={`line line-${i + 1}`} key={i} />
        ))}
      </div>
      <div className="about-me-content no-card">
        <h1>About Me</h1>
        <p>
        I'm Shaunak, a Master’s graduate in Computer Science from Trinity College Dublin, passionate about solving real-world problems through intelligent software and system design. With a strong academic foundation and hands-on experience in full-stack development, distributed systems, and AI/ML, I bring both depth and versatility to every project I work on.
        </p>
        <p>
          I'm currently diving deep into the MERN stack, 3D web experiences, and motion UI.
          Outside coding, I’m into photography, storytelling, and gaming.
        </p>
      </div>
    </section>
  );
};

export default AboutMe;
// ... existing code ...