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
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">Rehome a Pet</h2>
        <p className="form-subtitle">Upload one or more photos to showcase your pet's personality.</p>
        
        <form onSubmit={handleSubmit} className="form-element">
          <div className="form-group">
            <label className="form-label">Pet Photos (Upload up to 5)</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageChange} 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
            />
            
            <div className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
              <Camera size={32} color="#ff7a59" />
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#718096' }}>Click to choose pictures</p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="preview-grid">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="preview-wrapper">
                    <img src={url} alt="Preview thumbnail" className="preview-thumbnail" />
                    <button type="button" onClick={() => removeImage(index)} className="preview-remove-btn">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Pet's Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" placeholder="e.g., Felix" />
          </div>

          <div className="form-group">
            <label className="form-label">Type of Animal</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="form-input">
              <option value="Cat">Cat</option>
              <option value="Dog">Dog</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Age / Life Stage</label>
            <input type="text" value={age} onChange={(e) => setAge(e.target.value)} required className="form-input" placeholder="e.g., 2 years old" />
          </div>

          <div className="form-group">
            <label className="form-label">Your Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="form-input" placeholder="e.g., +92 300 1234567" />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required className="form-textarea" placeholder="Personality quirks, friendliness, etc..." />
          </div>

          <button type="submit" disabled={uploading} className="form-submit-btn">
            {uploading ? 'Publishing...' : 'Publish to Adoption Feed'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;