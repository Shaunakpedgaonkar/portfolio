import React from "react";
import "./ExperienceSection.css";

const experiences = [
  {
    company: "NOMS Consulting Pvt Ltd",
    role: "Software Engineer",
    duration: "Mar 2025 – Present",
    projects: [
      {
        name: "Adore CRM: Enterprise Sales Pipeline Platform",
        bullets: [
          {
            label: "High-Scale Data Architecture",
            text: "Architected an enterprise CRM supporting hierarchical workflows for 500+ product SKUs, leveraging MongoDB aggregation pipelines to deliver sub-200ms dashboard latency and reducing frontend overhead by 90%.",
          },
          {
            label: "Security & Identity",
            text: "Enforced a 4-tier Role-Based Access Control (RBAC) system to eliminate data leakage and implemented Redis-backed OTP authentication, sustaining <50ms verification latency while preventing brute-force attacks.",
          },
          {
            label: "Distributed Systems Reliability",
            text: "Designed a concurrency-safe stateful workflow engine with full audit history, ensuring zero data loss during high-volume lifecycle transitions.",
          },
          {
            label: "Cloud Infrastructure",
            text: "Integrated AWS S3 for signed storage, offloading 100% of file I/O from the application layer to enable seamless horizontal scalability and cost efficiency.",
          },
        ],
      },
      {
        name: "Article Academy: Educational Platform",
        bullets: [
          {
            label: "Performance Engineering",
            text: "Delivered a React/TypeScript platform for 1,000+ users using a mobile-first architecture; engineered a reusable component system that reduced code duplication by 40%.",
          },
          {
            label: "API & Asset Optimization",
            text: "Optimized asset rendering and integrated lead-capture APIs to improve Largest Contentful Paint (LCP) and overall system responsiveness.",
          },
        ],
      },
    ],
  },
  {
    company: "AMS BuildTech Pvt Ltd",
    role: "Software Engineer (Programming Analyst)",
    duration: "Jan 2022 – Jun 2023",
    projects: [
      {
        name: null,
        bullets: [
          {
            label: "Microservices Development",
            text: "Developed and maintained distributed Java and Python microservices, improving system resilience and handling increased production traffic.",
          },
          {
            label: "Reliability & Monitoring",
            text: "Built automated monitoring and alerting pipelines that reduced system downtime by 20%, focusing on high-availability metrics.",
          },
          {
            label: "DevOps & Automation",
            text: "Orchestrated CI/CD pipelines that accelerated deployment frequency by 30%, reducing manual release friction and improving developer velocity.",
          },
          {
            label: "Production Support",
            text: "Authored technical documentation and delivered secure production features, improving support ticket resolution efficiency by 25%.",
          },
        ],
      },
    ],
  },
];

const ExperienceSection = () => {
  return (
    <div className="experience-timeline">
      <h1 className="timeline-title">Experience</h1>
      <div className="timeline">
        {experiences.map((exp, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <h2>{exp.role} | {exp.company}</h2>
              <span className="timeline-duration">{exp.duration}</span>
              {exp.projects.map((project, pIndex) => (
                <div key={pIndex} className="timeline-project">
                  {project.name && (
                    <h3 className="exp-project-name">{project.name}</h3>
                  )}
                  <ul className="timeline-description">
                    {project.bullets.map((bullet, bIndex) => (
                      <li key={bIndex}>
                        <strong>{bullet.label}:</strong> {bullet.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
