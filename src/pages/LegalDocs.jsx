import React from 'react';

function LegalDocs() {
  return (
    <div style={{ padding: '20px', color: '#2d3748', lineHeight: '1.6', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.8rem', color: '#1a202c', marginBottom: '15px' }}>User Data Guidelines</h2>
      <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '20px' }}>Last Updated: June 2026</p>

      <p style={{ marginBottom: '15px' }}>
        We care about protecting your information. This document outlines how data is handled on our application.
      </p>

      <h3 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>1. Information Collected</h3>
      <p style={{ marginBottom: '15px' }}>
        When you authenticate using Google Sign-In, our authentication system (powered securely by Supabase) receives your basic profile details, such as your email address and name.
      </p>

      <h3 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>2. How Information is Used</h3>
      <p style={{ marginBottom: '15px' }}>
        Your data is strictly used to associate adoption listings with a verified creator. We do not sell, trade, or share your contact details with external third-party marketing services.
      </p>

      <h3 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>3. Analytics Information</h3>
      <p style={{ marginBottom: '15px' }}>
        We utilize minor, non-invasive hosting analytics to monitor site performance and count aggregate visitor traffic. No direct, identifiable personal data is tracked or parsed by this tool.
      </p>
    </div>
  );
}

export default LegalDocs;