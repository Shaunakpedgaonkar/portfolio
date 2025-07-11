import React from "react";
import "./ExperienceSection.css";

const experiences = [
  {
    company: "AMS BuildTech Pvt Ltd",
    role: "Intern",
    duration: "May 2021 – August 2021",
    description: [
      "Developed internal tools for project scheduling and cost estimation, reducing budgeting cycle time by 15%.",
      "Built real-time interactive dashboards using Excel and Python, improving stakeholder reporting clarity by 20%.",
      "Assisting project managers and engineers in the planning and execution of construction projects.",
      "Collaborating with team members to prepare project reports, progress updates, and documentation.",
      "Assisting project managers and engineers in the planning and execution of construction projects",
      "Supporting project teams in cost estimation, budgeting, and resource allocation",
      ,
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
