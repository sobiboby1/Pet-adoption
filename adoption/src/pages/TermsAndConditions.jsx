import React from 'react';

function TermsAndConditions() {
  return (
    <div style={{ padding: '20px', color: '#2d3748', lineHeight: '1.6', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.8rem', color: '#1a202c', marginBottom: '15px' }}>Terms & Conditions</h2>
      <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '20px' }}>Last Updated: June 2026</p>
      
      <p style={{ marginBottom: '15px' }}>
        Welcome to our Pet Adoption Platform. By accessing or using this website, you agree to comply with and be bound by the following terms.
      </p>

      <h3 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>1. Platform Purpose</h3>
      <p style={{ marginBottom: '15px' }}>
        This platform acts as a community venue for connecting individuals looking to rehome or adopt animals. We do not own, manage, or take direct responsibility for any animals listed on the platform.
      </p>

      <h3 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>2. User Responsibilities</h3>
      <p style={{ marginBottom: '15px' }}>
        Users are entirely responsible for providing accurate information in their listings. Any form of animal abuse, fraudulent listings, or misleading details is strictly prohibited and will result in account termination.
      </p>

      <h3 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>3. Adoption Verification</h3>
      <p style={{ marginBottom: '15px' }}>
        Adopters and posters are expected to conduct their own thorough vetting and physical inspections before finalizing an adoption. We are not liable for any disputes or issues arising post-adoption.
      </p>
    </div>
  );
}

export default TermsAndConditions;