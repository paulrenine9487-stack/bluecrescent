import React from 'react';
import { ArrowRight } from 'lucide-react';
import './ProjectInMindCTASection.css';

export default function ProjectInMindCTASection({ onNavigate }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('Contact Us');
    }
  };

  return (
    <section className="project-cta-section" id="project-cta-section">
      {/* Subtle Technical Background Grid */}
      <div className="project-cta-bg-grid" />

      {/* Main Content Container */}
      <div className="project-cta-container">
        {/* Heading */}
        <h2 className="project-cta-heading">
          Have a Project in Mind?
        </h2>

        {/* Blue Gradient Accent Line */}
        <div className="project-cta-divider" />

        {/* Descriptive Statement */}
        <p className="project-cta-desc">
          Bring us your challenge.<br />
          Our team will bring the engineering, technology and commitment to move it forward.
        </p>

        {/* Primary Action Button */}
        <button 
          className="project-cta-btn"
          onClick={handleClick}
          aria-label="Let's connect with Blue Crescent Engineering"
        >
          <span>LET’S CONNECT</span>
          <span className="project-cta-arrow">
            <ArrowRight size={18} strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </section>
  );
}
