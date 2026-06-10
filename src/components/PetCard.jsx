import React from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

function PetCard({ pet, onContactClick, currentUser, refreshPosts }) {
  const isOwner = currentUser && currentUser.id === pet.user_id;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${pet.name} from adoption?`)) {
      try {
        const { error } = await supabase
          .from('listings')
          .delete()
          .eq('id', pet.id);

        if (error) throw error;
        toast.success("Listing successfully removed.");
        if (refreshPosts) refreshPosts();
      } catch (err) {
        toast.error("Failed to delete post: " + err.message);
      }
    }
  };

  return (
    <div className="pet-card">
      <div 
        className="pet-card-image"
        style={{ 
          backgroundImage: `url(${pet.images && pet.images[0] ? pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'})` 
        }} 
      />
      <div className="pet-card-body">
        <div className="pet-card-header-row">
          <span className="pet-card-badge">{pet.type}</span>
          <span className="pet-card-author">By: {pet.posted_by}</span>
        </div>
        
        <div className="pet-card-title-row">
          <h3 className="pet-card-name">{pet.name}</h3>
          {isOwner && (
            <button onClick={handleDelete} className="pet-card-delete-btn" title="Delete Post">
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <p className="pet-card-age"><strong>Age:</strong> {pet.age}</p>
        <p className="pet-card-desc">{pet.description}</p>
        
        <button className="pet-card-btn" onClick={() => onContactClick(pet)}>
          Contact Owner
        </button>
      </div>
    </div>
  );
}

export default PetCard;