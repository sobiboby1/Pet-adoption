import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="about-container">
      {/* 🐱 Personal Story Section */}
      <section className="about-section">
        <h1 className="about-title">Why I Built This Platform 🐾</h1>
        <p className="about-text">
          In Memory of Motu (Ash) 🐾<br />
          Developed in the beloved memory of my stray cat, Motu (AKA Ash).<br /><br />
          She was a deeply loved, incredibly intelligent, and loving animal who spent 2 wonderful years with me. Miss her so much.
        </p>
        
        {/* Cat Pics Container */}
        <div className="about-cat-grid">
          <img src="/3.jpeg" alt="My Cat 3" className="about-cat-img" />
          <img src="/2.jpeg" alt="My Cat 2" className="about-cat-img" />
          <img src="/1.jpeg" alt="My Cat 1" className="about-cat-img" />
          <img src="/4.jpeg" alt="My Cat 4" className="about-cat-img" />
          <img src="/5.jpeg" alt="My Cat 5" className="about-cat-img" />
        </div>
      </section>

      {/* 📄 Legal & Guidelines Links Section */}
      <section className="about-section">
        <h2 className="about-subtitle">Platform Documentation</h2>
        <p className="about-subtext">
          Please review our official guidelines and data policies before posting or adopting.
        </p>
        
        <div className="about-links-stack">
          <Link to="/terms" className="about-doc-link">
            📋 Read Terms & Conditions
          </Link>
          <Link to="/legal" className="about-doc-link">
            🔒 Read Privacy & User Data Guidelines
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;