import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PetCard from '../components/PetCard';
import { X, Phone, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1>Find Your New Best Friend</h1>
        <p>Browse through loving pets looking for a second chance at a forever home.</p>
      </div>

      {loading ? (
        <div style={styles.center}>Loading active listings...</div>
      ) : posts.length === 0 ? (
        <div style={styles.center}>No pets up for adoption right now. Check back soon!</div>
      ) : (
        <div style={styles.grid}>
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
        <div style={styles.overlay} onClick={() => setSelectedPet(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedPet(null)}>
              <X size={20} />
            </button>
            
            <div style={styles.sliderContainer}>
              <img 
                src={selectedPet.images && selectedPet.images[currentImgIndex] ? selectedPet.images[currentImgIndex] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'} 
                alt={`${selectedPet.name} view`} 
                style={styles.modalImg} 
              />
              
              {selectedPet.images && selectedPet.images.length > 1 && (
                <>
                  <button onClick={prevSlide} style={{ ...styles.arrowBtn, left: '10px' }}>
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextSlide} style={{ ...styles.arrowBtn, right: '10px' }}>
                    <ChevronRight size={24} />
                  </button>
                  <div style={styles.dotsRow}>
                    {selectedPet.images.map((_, i) => (
                      <div key={i} style={{ ...styles.dot, backgroundColor: currentImgIndex === i ? '#ff7a59' : 'rgba(255,255,255,0.6)' }} />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div style={styles.modalContent}>
              <span style={styles.modalBadge}>{selectedPet.type}</span>
              <h2>Adopt {selectedPet.name}</h2>
              <p style={styles.modalAge}><strong>Age Stage:</strong> {selectedPet.age}</p>
              <p style={styles.modalAuthor}><strong>Listed By:</strong> {selectedPet.posted_by}</p>
              
              <hr style={styles.divider} />
              
              <h3>About this Pet</h3>
              <p style={styles.modalDesc}>{selectedPet.description}</p>
              
              {user ? (
                <div style={styles.phoneBox}>
                  <Phone size={18} color="#ff7a59" style={{ marginRight: '8px' }} />
                  <div>
                    <span style={styles.phoneLabel}>Owner's Phone Number:</span>
                    <strong style={styles.phoneNumber}>
                      {selectedPet.phone || "No phone number provided"}
                    </strong>
                  </div>
                </div>
              ) : (
                <div style={styles.lockedBox}>
                  <Lock size={18} color="#718096" style={{ marginRight: '8px' }} />
                  <p style={styles.lockedText}>
                    Please <Link to="/auth" style={styles.authLink} onClick={() => setSelectedPet(null)}>Sign In</Link> to view the owner's contact information.
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

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' },
  hero: { textAlign: 'center', marginBottom: '3rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' },
  center: { textAlign: 'center', fontSize: '1.2rem', color: '#718096', padding: '4rem 0' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '480px', overflow: 'hidden', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  closeBtn: { position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', padding: '0.4rem', cursor: 'pointer', zIndex: 1010, display: 'flex' },
  sliderContainer: { position: 'relative', width: '100%', height: '260px', background: '#1a202c', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalImg: { width: '100%', height: '100%', objectFit: 'cover' },
  arrowBtn: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', color: '#2d3748', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.15)', transition: 'background 0.2s' },
  dotsRow: { position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '20px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', transition: 'background-color 0.2s' },
  modalContent: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  modalBadge: { background: '#fff0ec', color: '#ff7a59', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', alignSelf: 'flex-start' },
  modalAge: { color: '#4a5568', fontSize: '0.95rem', margin: 0 },
  modalAuthor: { color: '#718096', fontSize: '0.9rem', margin: 0 },
  divider: { border: 0, borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' },
  modalDesc: { color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 1rem 0' },
  phoneBox: { display: 'flex', alignItems: 'center', background: '#fff9f7', border: '1px dashed #ff7a59', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' },
  phoneLabel: { display: 'block', fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', fontWeight: 'bold' },
  phoneNumber: { fontSize: '1.2rem', color: '#2d3748', display: 'block', marginTop: '2px' },
  lockedBox: { display: 'flex', alignItems: 'center', background: '#f7fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' },
  lockedText: { margin: 0, color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.4' },
  authLink: { color: '#ff7a59', fontWeight: 'bold', textDecoration: 'none' }
};

export default Adoption;