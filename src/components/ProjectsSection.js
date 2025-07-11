import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import GLOBE from 'vanta/dist/vanta.globe.min';
import './ProjectsSection.css';

const projects = [
  {
    title: "Global Loyalty Card System",
    fullDescription:
      "Designed and deployed a globally distributed loyalty system across US, Ireland, India using Flask, MySQL Group Replication, and AWS. Achieved 99.9% uptime with <5s failover and 10K+ user concurrency. Integrated JWT-secured APIs, OpenTelemetry, and Dockerized deployment.",
    mobileDescription:
      "Built a globally distributed loyalty system across 3 regions using MySQL replication, Flask APIs, and AWS infrastructure.\n\nAchieved 99.9% uptime with <5s failover, OpenTelemetry-based monitoring, and 10K+ concurrent user load support.",
    link: "https://github.com/Shaunakpedgaonkar/global-loyalty-system",
  },
  {
    title: "Machine Translation Evaluation",
    fullDescription:
      "Benchmarked 4 MT models (Seq2Seq, LSTM, MarianMT, NAS/MoE) on 700K+ multilingual sentence pairs using BLEU, CHRF, ROUGE. MarianMT outperformed with CHRF: 63.7 (+12%). Proposed hybrid metric improving human correlation by +0.18.",
    mobileDescription:
      "Benchmarked 4 MT models on 700K+ sentences across low-resource pairs using BLEU/CHRF/ROUGE.\n\nMarianMT scored CHRF: 63.7 (+12%) and BLEU: +8.3; hybrid metric improved human-alignment by +0.18.",
    link: "https://github.com/Shaunakpedgaonkar/Machine-translation/tree/main",
  },
  {
    title: "Mars-Rover Communication System",
    fullDescription:
      "Engineered a secure, decentralized P2P mesh for Mars rover data sharing using UDP discovery and TLS-encrypted TCP. Achieved resilient async communication under 30%+ packet loss with dynamic routing and <200ms latency.",
    mobileDescription:
      "Engineered a secure, decentralized mesh network for rover communication using UDP + TLS-encrypted TCP.\n\nSustained <200ms latency and 30%+ packet loss with FIB-based dynamic routing and async I/O.",
    link: "https://github.com/Shaunakpedgaonkar/Dynamic-Sensor-Based-Networking-for-Inter-Rover-Coordination",
  },
  {
    title: "Apache Lucene Search Engine",
    fullDescription:
      "Developed a full-text search engine using Apache Lucene over 1,400+ aerospace documents. Implemented BM25/VSM scoring, tuned analyzers, and achieved MAP: 0.90, Recall: 0.96 with 22% less memory usage.",
    mobileDescription:
      "Developed a Lucene-based search engine over 1,400+ aerospace documents using BM25/VSM scoring.\n\nTuned analyzers to achieve MAP: 0.90, Recall: 0.96, and reduce memory usage by 22%.",
    link: "https://github.com/Shaunakpedgaonkar/Lucene-search-engine",
  },
  {
    title: "City Disaster Response System",
    fullDescription:
      "Built a real-time disaster-aware rerouting platform using Django, AWS Step Functions, and Google Maps API. Achieved <3s hazard response, served 5K+ users, and integrated an NLP chatbot with 92% query accuracy.",
    mobileDescription:
      "Built a real-time hazard-aware rerouting system using Django + AWS Step Functions + Google Maps API.\n\nDelivered <3s response latency; NLP chatbot achieved 92% intent recognition across 5K+ users.",
    link: "https://github.com/Shaunakpedgaonkar/NEW-ASE",
  }
  

];

export default function ProjectsSection() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [expandedMobile, setExpandedMobile] = useState(null);

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (!vantaEffect && vantaRef.current && THREE && GLOBE) {
      const effect = GLOBE({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x000000,
        color: 0xff3f81,
        color2: 0xffffff,
        size: 1.0,
        points: 8.0,
        maxDistance: 20.0,
        spacing: 15.0,
        showDots: false,
      });
      setVantaEffect(effect);
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const toggleMobile = (title) => {
    setExpandedMobile((prev) => (prev === title ? null : title));
  };

  return (
    <div className="projects-section">
      <div ref={vantaRef} className="vanta-background" />

      <div className="projects-content">
        <h2 className="projects-heading">Projects</h2>
        <div className="project-list">
          {projects.map((project, index) => {
            const isHovered = hovered === project.title;
            const isExpanded = expandedMobile === project.title;

            return (
              <div
                key={index}
                className="project-wrapper"
                onMouseEnter={() => !isMobile && setHovered(project.title)}
                onMouseLeave={() => !isMobile && setHovered(null)}
                onClick={() => isMobile && toggleMobile(project.title)}
              >
                <div className="project-name">{project.title}</div>

                {/* Desktop: Full popup on hover */}
                {!isMobile && isHovered && (
                  <div className="popup-box desktop">
                    <p>{project.fullDescription}</p>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="view-button">
                      View Project
                    </a>
                  </div>
                )}

                {/* Mobile: Collapsible shorter text */}
                {isMobile && (
                  <div className={`popup-box mobile ${isExpanded ? 'show' : ''}`}>
                    <p>{project.mobileDescription}</p>
                    {isExpanded && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="view-button">
                        View
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
