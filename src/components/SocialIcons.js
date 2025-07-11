import React from 'react';
import { FaGithub, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import './SocialIcons.css';
 
export default function SocialIcons() {
  return (
    <div className="social-icons">
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