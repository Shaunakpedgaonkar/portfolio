import React from "react";
import "./ExperienceSection.css";

const experiences = [
  {
    company: "AMS BuildTech Pvt Ltd, Pune, India",
    role: "Programming Analyst",
    duration: "Jan 2022 – Jul 2023",
    description: [
      "Spearheaded development of Flask- and Java-based microservices, automation scripts, and Python-powered Excel dashboards to optimize scheduling, cost estimation, and KPI reporting across 5+ enterprise/construction projects.",
      "Reduced planning time by 25% and reporting time by 20% by streamlining workflows and replacing manual processes with data-driven automation",
      "Built system health and monitoring tools (CPU, memory, connections) that improved fault detection, reduced downtime, and enhanced reliability",
      "Streamlined resource allocation processes, accelerating project timelines and improving budgeting accuracy",
      "Maintained clear technical documentation and optimized post-deployment support, improving internal issue resolution speed by 20%",
      "Collaborated with cross-functional teams (project managers, engineers, QA, stakeholders) in agile sprints, contributing to planning, testing, code reviews, and release readiness",
      
    ],
    technologies: [], // No specific technologies listed for now.
  },
];

const ExperienceSection = () => {
  return (
    <div className="experience-timeline">
      <h1 className="timeline-title">💼 Experience</h1>
      <div className="timeline">
        {experiences.map((exp, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <h2>{exp.role} @ {exp.company}</h2>
              <span className="timeline-duration">{exp.duration}</span>
              <ul className="timeline-description">
                {exp.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <div className="timeline-tech">
                {exp.technologies.map((tech, i) => (
                  <span className="tech-tag" key={i}>{tech}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
