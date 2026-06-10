import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PetCard from '../components/PetCard';
import { X, Phone, Lock, ChevronLeft, ChevronRight, Download } from 'lucide-react';

function Adoption({ posts, loading, user, refreshPosts }) {
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleOpenModal = (pet) => {
    setSelectedPet(pet);
    setCurrentImgIndex(0);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    if (!selectedPet?.images) return;
    setCurrentImgIndex((prev) => (prev === selectedPet.images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    if (!selectedPet?.images) return;
    setCurrentImgIndex((prev) => (prev === 0 ? selectedPet.images.length - 1 : prev - 1));
  };

  return (
    <div className="container">
      <div className="adopt-hero" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>Find Your New Best Friend</h1>
        <p style={{ marginBottom: '20px' }}>Browse through loving pets looking for a second chance at a forever home.</p>
        
        {/* --- HIGH VISIBILITY STYLED DOWNLOAD BUTTON --- */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
          <a 
            href="https://drive.usercontent.google.com/download?id=1msqIns_dJB0RTJJ--leoxgQdS9ZBLNK4&export=download"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ff7a59', /* Solid vibrant coral brand color */
              color: '#ffffff',          /* Bright white text for absolute contrast */
              padding: '10px 22px',
              borderRadius: '30px',
              fontSize: '0.9rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 4px 10px rgba(255, 122, 89, 0.3)',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e56847';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(255, 122, 89, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ff7a59';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(255, 122, 89, 0.3)';
            }}
          >
            <Download size={16} strokeWidth={2.5} color="#ffffff" />
            Download Android App (APK)
          </a>
        </div>
        {/* ----------------------------------------------- */}
      </div>

      {loading ? (
        <div className="adopt-center">Loading active listings...</div>
      ) : posts.length === 0 ? (
        <div className="adopt-center">No pets up for adoption right now. Check back soon!</div>
      ) : (
        <div className="adopt-grid">
          {posts.map((pet) => (
            <PetCard 
              key={pet.id} 
              pet={pet} 
              onContactClick={handleOpenModal}
              currentUser={user}
              refreshPosts={refreshPosts}
            />
          ))}
        </div>
      )}

      {selectedPet && (
        <div className="adopt-overlay" onClick={() => setSelectedPet(null)}>
          <div className="adopt-modal" onClick={(e) => e.stopPropagation()}>
            <button className="adopt-close-btn" onClick={() => setSelectedPet(null)}>
              <X size={20} />
            </button>
            
            <div className="adopt-slider-container">
              <img 
                src={selectedPet.images && selectedPet.images[currentImgIndex] ? selectedPet.images[currentImgIndex] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'} 
                alt={`${selectedPet.name} view`} 
                className="adopt-modal-img" 
              />
              
              {selectedPet.images && selectedPet.images.length > 1 && (
                <>
                  <button onClick={prevSlide} className="adopt-arrow-btn left-arrow">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextSlide} className="adopt-arrow-btn right-arrow">
                    <ChevronRight size={24} />
                  </button>
                  <div className="adopt-dots-row">
                    {selectedPet.images.map((_, i) => (
                      <div key={i} className="adopt-dot" style={{ backgroundColor: currentImgIndex === i ? '#ff7a59' : 'rgba(255,255,255,0.6)' }} />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="adopt-modal-content">
              <span className="adopt-modal-badge">{selectedPet.type}</span>
              <h2>Adopt {selectedPet.name}</h2>
              <p className="adopt-modal-meta"><strong>Age Stage:</strong> {selectedPet.age}</p>
              <p className="adopt-modal-meta"><strong>Listed By:</strong> {selectedPet.posted_by}</p>
              
              <hr className="adopt-divider" />
              
              <h3>About this Pet</h3>
              <p className="adopt-modal-desc">{selectedPet.description}</p>
              
              {user ? (
                <div className="adopt-phone-box">
                  <Phone size={18} color="#ff7a59" style={{ marginRight: '8px', flexShrink: 0 }} />
                  <div>
                    <span className="adopt-phone-label">Owner's Phone Number:</span>
                    <strong className="adopt-phone-number">
                      {selectedPet.phone || "No phone number provided"}
                    </strong>
                  </div>
                </div>
              ) : (
                <div className="adopt-locked-box">
                  <Lock size={18} color="#718096" style={{ marginRight: '8px', flexShrink: 0 }} />
                  <p className="adopt-locked-text">
                    Please <Link to="/auth" className="adopt-auth-link" onClick={() => setSelectedPet(null)}>Sign In</Link> to view the owner's contact information.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Adoption;