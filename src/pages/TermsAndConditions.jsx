import React from 'react';

function TermsAndConditions() {
  return (
    <div className="legal-container">
      <h2 className="legal-title">Terms & Conditions</h2>
      <p className="legal-date">Last Updated: June 2026</p>
      
      <p className="legal-paragraph">
        Welcome to our Pet Adoption Platform. By accessing or using this website, you agree to comply with and be bound by the following terms.
      </p>

      <h3 className="legal-heading">1. Platform Purpose</h3>
      <p className="legal-paragraph">
        This platform acts as a community venue for connecting individuals looking to rehome or adopt animals. We do not own, manage, or take direct responsibility for any animals listed on the platform.
      </p>

      <h3 className="legal-heading">2. User Responsibilities</h3>
      <p className="legal-paragraph">
        Users are entirely responsible for providing accurate information in their listings. Any form of animal abuse, fraudulent listings, or misleading details is strictly prohibited and will result in account termination.
      </p>

      <h3 className="legal-heading">3. Adoption Verification</h3>
      <p className="legal-paragraph">
        Adopters and posters are expected to conduct their own thorough vetting and physical inspections before finalizing an adoption. We are not liable for any disputes or issues arising post-adoption.
      </p>
    </div>
  );
}

export default TermsAndConditions;