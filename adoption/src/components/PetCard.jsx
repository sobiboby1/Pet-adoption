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
    <div style={styles.card}>
      <div 
        style={{ 
          ...styles.image, 
          backgroundImage: `url(${pet.images && pet.images[0] ? pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'})` 
        }} 
      />
      <div style={styles.body}>
        <div style={styles.headerRow}>
          <span style={styles.badge}>{pet.type}</span>
          <span style={styles.author}>By: {pet.posted_by}</span>
        </div>
        
        <div style={styles.titleRow}>
          <h3 style={styles.name}>{pet.name}</h3>
          {isOwner && (
            <button onClick={handleDelete} style={styles.deleteBtn} title="Delete Post">
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <p style={styles.age}><strong>Age:</strong> {pet.age}</p>
        <p style={styles.desc}>{pet.description}</p>
        
        <button style={styles.btn} onClick={() => onContactClick(pet)}>
          Contact Owner
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  image: { height: '220px', backgroundSize: 'cover', backgroundPosition: 'center' },
  body: { padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', height: '100%' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { background: '#fff0ec', color: '#ff7a59', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' },
  author: { fontSize: '0.75rem', color: '#718096' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.2rem 0' },
  name: { fontSize: '1.3rem', color: '#2d3748', margin: 0, fontWeight: '700' },
  deleteBtn: { background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center' },
  age: { fontSize: '0.9rem', color: '#4a5568' },
  desc: { fontSize: '0.9rem', color: '#718096', lineHeight: '1.4' },
  btn: { background: '#ff7a59', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: 'auto' }
};

export default PetCard;