import React from 'react';

function About() {
  return (
    <div className="about-container">
      {/* Our Inspiration Section - Main Entry */}
      <div className="about-section" style={{ marginTop: '1rem' }}>
        <h3 className="about-subtitle">Why I Built This Website</h3>
        <p className="about-text">
          This platform was born out of a deep-seated love for stray animals and the belief that every pet 
          deserves a warm, loving home. This entire project was built in the beloved memory of my cat, 
          <strong> Motu (aka Ash)</strong>, who continues to inspire me every single day to grow this 
          platform and help vulnerable animals across our local communities.
        </p>
        
        {/* Cat Image Grid */}
        <div className="about-cat-grid">
          <img 
            src="/1.jpeg" 
            alt="In Memory of Motu" 
            className="about-cat-img" 
          />
          <img 
            src="/3.jpeg" 
            alt="Beloved Motu aka Ash" 
            className="about-cat-img" 
          />
          <img 
            src="/5.jpeg" 
            alt="PetAdopt Inspiration" 
            className="about-cat-img" 
          />
        </div>
      </div>

      {/* Platform Guidelines & Resources Section */}
      <div className="about-section">
        <h3 className="about-subtitle">Platform Guidelines & Resources</h3>
        <p className="about-subtext">
          Please review our documentation before listing an animal or completing an adoption process.
        </p>
        
        <div className="about-links-stack">
          <a href="/legal" className="about-doc-link">Read User Data Guidelines</a>
          <a href="/terms" className="about-doc-link">Read Terms & Conditions</a>
          
          {/* --- DIRECT ANDROID APK DOWNLOAD CARD --- */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            background: '#fff9f7',
            border: '1px dashed var(--primary)',
            borderRadius: '12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <h4 style={{ color: 'var(--dark)', fontSize: '1.1rem', fontWeight: '700' }}>
              Take PetAdopt on the Go!
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#718096', maxWidth: '420px', margin: '0' }}>
              Download our standalone Android App (`.apk`) directly to your mobile device for quick browsing, rapid animal screening, and fluid listing management.
            </p>
            <a 
              href="https://drive.google.com/download/101?id=1msqIns_dJB0RTJJ--leoxgQdS9ZBLNK4" 
              className="form-submit-btn"
              style={{ 
                textDecoration: 'none', 
                display: 'inline-block', 
                padding: '0.6rem 1.5rem',
                fontSize: '0.95rem',
                marginTop: '5px'
              }}
            >
              Download APK for Android
            </a>
          </div>
          {/* -------------------------------------- */}
        </div>
      </div>
    </div>
  );
}

export default About;