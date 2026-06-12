import React, { useState, useEffect } from 'react';
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
    age: '', 
    phone: '',
    description: ''
  });

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

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

    // Revoke previous URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url));

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
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.75);
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
      for (let i = 0; i < selectedFiles.length; i++) {
        const compressedBlob = await compressImage(selectedFiles[i]);
        const fileName = `${user.id}-${Date.now()}-${i}.jpg`;
        const { error: uploadError } = await supabase.storage.from('pet-media').upload(fileName, compressedBlob);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('pet-media').getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }

      const { error: dbError } = await supabase.from('listings').insert([{
        ...formData,
        images: uploadedUrls.length > 0 ? uploadedUrls : ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'],
        user_id: user.id,
        posted_by: user.email?.split('@')[0] || 'Anonymous'
      }]);

      if (dbError) throw dbError;
      toast.success("Pet listing published!");
      setIsRehomeOpen(false);
      setFormData({ name: '', type: 'Cat', age: '', phone: '', description: '' });
      setImagePreviews([]);
      if (refreshPosts) refreshPosts();
    } catch (err) {
      toast.error("Submission failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      {/* ... (Keep your hero and grid JSX same as before) ... */}
      {/* Ensure the owner details block uses the user ? ... : ... logic provided previously */}
    </div>
  );
}

export default Adoption;