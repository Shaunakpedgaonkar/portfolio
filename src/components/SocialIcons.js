import React from 'react';
import { FaGithub, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import './SocialIcons.css';

export default function SocialIcons({ pageIndex = 0 }) {
  // Hide on experience page (index 3) to avoid overlapping text
  const hidden = pageIndex === 3;

  return (
    <div className={`social-icons ${hidden ? 'social-icons-hidden' : ''}`}>
      <a href="https://github.com/Shaunakpedgaonkar" target="_blank" rel="noopener noreferrer">
        <FaGithub />
      </a>
      <a href="mailto:shaunak.pedgaonkar@gmail.com">
        <FaEnvelope />
      </a>
      <a href="https://linkedin.com/in/shaunak-pedgaonkar-9567831b7" target="_blank" rel="noopener noreferrer">
        <FaLinkedin />
      </a>
    </div>
  );
}