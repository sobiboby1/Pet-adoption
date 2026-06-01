import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* 🐱 Personal Story Section */}
      <section style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        <h1 style={{ color: '#2d3748', fontSize: '2rem', marginBottom: '15px' }}>Why I Built This Platform 🐾</h1>
        <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
          In Memory of Motu (Ash) 🐾
Developed in the beloved memory of my stray cat, Motu (AKA Ash).

She was a deeply loved, incredibly intelligent, and loving animal who spent 2 wonderful years with me. Miss her so much.


        </p>
        
        {/* Cat Pics Container */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          
          {/* 🐱 Cat Picture 1 */}
          <img 
            src="/3.jpeg" 
            alt="My Cat 3" 
            style={{ 
              width: '200px', 
              height: '200px', 
              objectFit: 'cover', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }} 
          />

          {/* 🐱 Cat Picture 2 */}
          <img 
            src="/2.jpeg" 
            alt="My Cat 2" 
            style={{ 
              width: '200px', 
              height: '200px', 
              objectFit: 'cover', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }} 
          />

          {/* 🐱 Cat Picture 3 */}
          <img 
            src="/1.jpeg" 
            alt="My Cat 1" 
            style={{ 
              width: '200px', 
              height: '200px', 
              objectFit: 'cover', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }} 
          />

          <img 
            src="/4.jpeg" 
            alt="My Cat 4" 
            style={{ 
              width: '200px', 
              height: '200px', 
              objectFit: 'cover', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }} 
          />

          {/* 🐱 Cat Picture 5 (New) - Change src to your file name */}
          <img 
            src="/5.jpeg" 
            alt="My Cat 5" 
            style={{ 
              width: '200px', 
              height: '200px', 
              objectFit: 'cover', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }} 
          />

        </div>
      </section>

      {/* 📄 Legal & Guidelines Links Section */}
      <section style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#2d3748', fontSize: '1.4rem', marginBottom: '15px' }}>Platform Documentation</h2>
        <p style={{ color: '#718096', marginBottom: '20px', fontSize: '0.95rem' }}>
          Please review our official guidelines and data policies before posting or adopting.
        </p>
        
        {/* Navigation Action Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <Link 
            to="/terms" 
            style={{ padding: '12px 15px', background: '#f7fafc', borderRadius: '8px', color: '#3182ce', textDecoration: 'none', fontWeight: '600', border: '1px solid #e2e8f0', display: 'block' }}
          >
            📋 Read Terms & Conditions
          </Link>
          
          <Link 
            to="/legal" 
            style={{ padding: '12px 15px', background: '#f7fafc', borderRadius: '8px', color: '#3182ce', textDecoration: 'none', fontWeight: '600', border: '1px solid #e2e8f0', display: 'block' }}
          >
            🔒 Read Privacy & User Data Guidelines
          </Link>

        </div>
      </section>

    </div>
  );
}

export default About;