import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
import { Camera, X } from 'lucide-react';

function CreatePost({ user, refreshPosts }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Cat');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState(''); 
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (imageFiles.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images per pet.");
      return;
    }

    const newFiles = [...imageFiles, ...files];
    const newPreviews = [...imagePreviews, ...files.map(file => URL.createObjectURL(file))];

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const removeImage = (indexToRemove) => {
    setImageFiles(imageFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one photo of the pet.");
      return;
    }
    setUploading(true);

    try {
      const uploadedUrls = [];

      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `pet-photos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pet-media')
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('pet-media').getPublicUrl(filePath);
          uploadedUrls.push(data.publicUrl);
        }
      }

      const authorName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous';

      const { error } = await supabase.from('listings').insert([
        { 
          name, 
          type, 
          age, 
          phone, 
          description, 
          images: uploadedUrls, 
          posted_by: authorName, 
          user_id: user?.id 
        }
      ]);
      
      if (error) throw error;
      
      toast.success(`${name} listed successfully!`);
      if (refreshPosts) await refreshPosts();
      navigate('/adoption');
    } catch (err) {
      toast.error(err.message || "Failed to submit post");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Rehome a Pet</h2>
        <p style={styles.subtitle}>Upload one or more photos to showcase your pet's personality.</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>Pet Photos (Upload up to 5)</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageChange} 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
            />
            
            <div style={styles.uploadPlaceholder} onClick={() => fileInputRef.current.click()}>
              <Camera size={32} color="#ff7a59" />
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#718096' }}>Click to choose pictures</p>
            </div>

            {imagePreviews.length > 0 && (
              <div style={styles.previewGrid}>
                {imagePreviews.map((url, index) => (
                  <div key={index} style={styles.previewWrapper}>
                    <img src={url} alt="Preview thumbnail" style={styles.thumbnail} />
                    <button type="button" onClick={() => removeImage(index)} style={styles.smallRemoveBtn}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Pet's Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} placeholder="e.g., Felix" />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Type of Animal</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
              <option value="Cat">Cat</option>
              <option value="Dog">Dog</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Age / Life Stage</label>
            <input type="text" value={age} onChange={(e) => setAge(e.target.value)} required style={styles.input} placeholder="e.g., 2 years old" />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Your Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={styles.input} placeholder="e.g., +92 300 1234567" />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required style={styles.textarea} placeholder="Personality quirks, friendliness, etc..." />
          </div>

          <button type="submit" disabled={uploading} style={styles.submitBtn}>
            {uploading ? 'Publishing...' : 'Publish to Adoption Feed'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', justifyContent: 'center', margin: '2rem auto', padding: '0 1rem' },
  formCard: { background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '550px' },
  title: { margin: '0 0 0.5rem 0', color: '#2d3748' },
  subtitle: { fontSize: '0.9rem', color: '#718096', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  group: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontWeight: '600', color: '#2d3748', fontSize: '0.95rem' },
  input: { padding: '0.7rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '1rem' },
  textarea: { padding: '0.7rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '1rem', resize: 'vertical' },
  uploadPlaceholder: { border: '2px dashed #ff7a59', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: '#fff9f7', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  previewGrid: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem', background: '#f7fafc', padding: '0.5rem', borderRadius: '6px' },
  previewWrapper: { position: 'relative', width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  thumbnail: { width: '100%', height: '100%', objectFit: 'cover' },
  smallRemoveBtn: { position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', padding: '2px', cursor: 'pointer', display: 'flex' },
  submitBtn: { background: '#ff7a59', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem' }
};

export default CreatePost;