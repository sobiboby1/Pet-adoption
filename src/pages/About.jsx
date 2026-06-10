import React from 'react';

function About() {
  return (
    <div className="about-container">
      {/* Introduction Section */}
      <div className="about-section">
        <h2 className="about-title">About PetAdopt</h2>
        <p className="about-text">
          Welcome to PetAdopt, a community-driven e-commerce platform dedicated to animal adoption in Pakistan. 
          Our mission is to bridge the gap between animal lovers, shelters, and individual rescuers, making 
          the rehoming process secure, transparent, and completely free. Whether you are looking to open 
          your home to a new companion or trying to find a safe sanctuary for a rescue cat or dog, we provide 
          the digital marketplace to make it happen safely.
        </p>
      </div>

      {/* Our Inspiration Section */}
      <div className="about-section">
        <h3 className="about-subtitle">Our Rescues & Inspiration</h3>
        <p className="about-text">
          This platform was born out of a deep-seated love for stray animals and the belief that every pet 
          deserves a warm, loving home. Here are a few of the sweet companions that keep us inspired 
          every single day to grow this platform across our local communities.
        </p>
        
        {/* Cat Image Grid */}
        <div className="about-cat-grid">
          <img 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=cover&q=80&w=400" 
            alt="Rescue Cat Sleeping" 
            className="about-cat-img" 
          />
          <img 
            src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=cover&q=80&w=400" 
            alt="Rescue Cat Looking Curiously" 
            className="about-cat-img" 
          />
          <img 
            src="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=cover&q=80&w=400" 
            alt="Playful Rescue Cat" 
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
              href="https://drive.google.com/uc?export=download&id=1MI6t9d_ZZH9Bla658ysB2O6dyv_wkHLn" 
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