import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PetCard from '../components/PetCard';
import { X, Phone, Lock, ChevronLeft, ChevronRight, Download, PlusCircle, Upload } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

function Adoption({ posts = [], loading, user, refreshPosts, isRehomeOpen, setIsRehomeOpen }) {
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // REHOME FORM STATE
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [imagePreviews, setImagePreviews] = useState([]); 

  const [formData, setFormData] = useState({
    name: '',
    type: 'Cat',
    age: '', // Added age property to match schema requirements
    phone: '',
    description: ''
  });

  const handleOpenModal = (pet) => {
    setSelectedPet(pet);
    setCurrentImgIndex(0);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    if (!selectedPet?.images || selectedPet.images.length === 0) return;
    setCurrentImgIndex((prev) => (prev === selectedPet.images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    if (!selectedPet?.images || selectedPet.images.length === 0) return;
    setCurrentImgIndex((prev) => (prev === 0 ? selectedPet.images.length - 1 : prev - 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length > 5) {
      toast.error("You can select up to 5 photos maximum.");
      return;
    }

    setSelectedFiles(files);
    const localPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(localPreviews);
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024; 
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.75);
        };
      };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to rehome a pet.");
      return;
    }

    try {
      setSubmitting(true);
      const uploadedUrls = [];
      
      console.log("Starting form submission. Total files selected:", selectedFiles.length);

      // 1. UPLOAD IMAGES TO STORAGE
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const compressedBlob = await compressImage(file);
        const fileName = `${user.id}-${Date.now()}-${i}.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('pet-media')
          .upload(fileName, compressedBlob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Supabase Storage Upload Error Details:", uploadError);
          alert(`Storage Error on image ${i + 1}: ${uploadError.message || JSON.stringify(uploadError)}`);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('pet-media')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      const finalImagesArray = uploadedUrls.length > 0 
        ? uploadedUrls 
        : ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'];

      // 2. INSERT METADATA RECORD WITH AGE INCLUDED
      console.log("Inserting metadata payload properties into listings database table...");
      const { data: dbData, error: dbError } = await supabase
        .from('listings')
        .insert([
          {
            name: formData.name,
            type: formData.type,
            age: formData.age, // Added to resolve the not-null constraint error
            phone: formData.phone,
            description: formData.description,
            images: finalImagesArray,
            user_id: user.id,
            posted_by: user.email ? user.email.split('@')[0] : 'Anonymous'
          }
        ])
        .select();

      if (dbError) {
        console.error("Supabase Database Insert Error Details:", dbError);
        alert(`Database Row Error: ${dbError.message || JSON.stringify(dbError)}`);
        throw dbError;
      }

      toast.success("Pet listing published successfully!");
      setIsRehomeOpen(false);
      
      setSelectedFiles([]);
      setImagePreviews([]);
      setFormData({
        name: '',
        type: 'Cat',
        age: '',
        phone: '',
        description: ''
      });

      if (refreshPosts) refreshPosts();
    } catch (err) {
      console.error("Critical submission lifecycle exception:", err);
      toast.error("Submission failed: " + (err.message || "Network exception or API error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="adopt-hero" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>Find Your New Best Friend</h1>
        <p style={{ marginBottom: '20px' }}>Browse through loving pets looking for a second chance at a forever home.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
          <a 
            href="https://drive.google.com/uc?export=download&id=1n8lAUqrJNkcDuausrvNfjGsimq8kElNR"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ff7a59',
              color: '#ffffff',
              padding: '10px 22px',
              borderRadius: '30px',
              fontSize: '0.9rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 4px 10px rgba(255, 122, 89, 0.3)',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }}
          >
            <Download size={16} strokeWidth={2.5} color="#ffffff" />
            Download Android App (APK)
          </a>
        </div>
      </div>

      {loading ? (
        <div className="adopt-center">Loading active listings...</div>
      ) : (!posts || posts.length === 0) ? (
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

      {/* --- LIVE VIEW DETAIL OVERLAY MODAL --- */}
      {selectedPet && (
        <div className="adopt-overlay" onClick={() => setSelectedPet(null)}>
          <div className="adopt-modal" onClick={(e) => e.stopPropagation()}>
            <button className="adopt-close-btn" onClick={() => setSelectedPet(null)}>
              <X size={20} />
            </button>
            
            <div className="adopt-slider-container">
              <img 
                src={selectedPet.images && selectedPet.images[currentImgIndex] ? selectedPet.images[currentImgIndex] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'} 
                alt={`${selectedPet.name || 'Pet'} view`} 
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
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="adopt-modal-badge">{selectedPet.type}</span>
                {selectedPet.age && <span className="adopt-modal-badge" style={{ backgroundColor: '#4a5568' }}>{selectedPet.age}</span>}
              </div>
              <h2>Adopt {selectedPet.name}</h2>
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

      {/* --- ADD NEW REHOME PET MODAL FORM LAYOUT --- */}
      {isRehomeOpen && (
        <div className="adopt-overlay" onClick={() => setIsRehomeOpen(false)} style={{ zIndex: 1100 }}>
          <div className="adopt-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <button className="adopt-close-btn" onClick={() => setIsRehomeOpen(false)}>
              <X size={20} />
            </button>
            
            <div className="adopt-modal-content" style={{ paddingTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <PlusCircle size={22} color="#ff7a59" />
                <h2 style={{ margin: 0 }}>Rehome a Pet</h2>
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#4a5568' }}>Pet Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '0.9rem' }} placeholder="e.g. Fluffy" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#4a5568' }}>Pet Type</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '0.9rem', backgroundColor: '#fff' }}>
                      <option value="Cat">Cat</option>
                      <option value="Dog">Dog</option>
                    </select>
                  </div>
                </div>

                {/* ADDED: Age Input Field to resolve database schema rejection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#4a5568' }}>Age</label>
                  <input type="text" name="age" value={formData.age} onChange={handleInputChange} required style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '0.9rem' }} placeholder="e.g. 2 Months, 1 Year" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#4a5568' }}>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '0.9rem' }} placeholder="e.g. 03XXXXXXXXX" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#4a5568' }}>Pet Photos (Up to 5)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      backgroundColor: '#edf2f7',
                      color: '#4a5568',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: '1px solid #cbd5e0',
                      width: '100%'
                    }}>
                      <Upload size={16} />
                      Choose Photos
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                    
                    {imagePreviews.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {imagePreviews.map((preview, index) => (
                          <div key={index} style={{
                            width: '55px',
                            height: '55px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e0',
                            backgroundImage: `url(${preview})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#4a5568' }}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '0.9rem', resize: 'none' }} placeholder="Tell us about the pet..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  style={{ width: '100%', backgroundColor: '#ff7a59', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', marginTop: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  {submitting ? 'Uploading & Publishing...' : 'Submit Listing'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Adoption;