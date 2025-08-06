import React from "react";
import "./ExperienceSection.css";

const experiences = [
  {
    company: "AMS BuildTech Pvt Ltd, Pune, India",
    role: "Programming Analyst",
    duration: "Jan 2022 – Jul 2023",
    description: [
      "Spearheaded the development of software tools that automated project scheduling and cost estimation, reducing planning time by 25% and improving budgeting accuracy",
      "Built data-driven Excel dashboards using Python to visualize construction KPIs across 5+ live projects, enhancing executive decision-making and reducing reporting time by 20%.",
      "Assisting project managers and engineers in the planning and execution of construction projects.",
      "Maintained clear technical documentation and provided on-call support, improving internal issue resolution speed by 20%.",
      "Streamlined resource allocation workflows by building scripts, replacing manual processes and accelerating project timelines",
      "Supporting project teams in cost estimation, budgeting, and resource allocation",
      
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
