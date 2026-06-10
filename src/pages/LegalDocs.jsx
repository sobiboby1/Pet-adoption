import React from 'react';

function LegalDocs() {
  return (
    <div className="legal-container">
      <h2 className="legal-title">User Data Guidelines</h2>
      <p className="legal-date">Last Updated: June 2026</p>

      <p className="legal-paragraph">
        We care about protecting your information. This document outlines how data is handled on our application.
      </p>

      <h3 className="legal-heading">1. Information Collected</h3>
      <p className="legal-paragraph">
        When you authenticate using Google Sign-In, our authentication system (powered securely by Supabase) receives your basic profile details, such as your email address and name.
      </p>

      <h3 className="legal-heading">2. How Information is Used</h3>
      <p className="legal-paragraph">
        Your data is strictly used to associate adoption listings with a verified creator. We do not sell, trade, or share your contact details with external third-party marketing services.
      </p>

      <h3 className="legal-heading">3. Analytics Information</h3>
      <p className="legal-paragraph">
        We utilize minor, non-invasive hosting analytics to monitor site performance and count aggregate visitor traffic. No direct, identifiable personal data is tracked or parsed by this tool.
      </p>
    </div>
  );
}

export default LegalDocs;