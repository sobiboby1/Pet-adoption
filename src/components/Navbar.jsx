import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogOut, PawPrint } from 'lucide-react';
import { toast } from 'react-toastify';

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out: " + error.message);
    } else {
      toast.success("Signed out successfully");
      navigate('/auth');
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/adoption" style={styles.logo}>
          <PawPrint size={26} color="#ff7a59" />
          <span style={styles.logoText}>PetAdopt</span>
        </Link>

        <div style={styles.links}>
          <Link to="/adoption" style={styles.link}>Adoption Feed</Link>
          <Link to="/create" style={styles.link}>Rehome a Pet</Link>
          <Link to="/about" style={styles.link}>About</Link>
          
        </div>

        <div style={styles.authSection}>
          {user ? (
            <div style={styles.profile}>
              <img 
                src={user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                alt="Profile" 
                style={styles.avatar} 
              />
              <button onClick={handleSignOut} style={styles.logoutBtn} title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" style={styles.loginBtn}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, padding: '0.8rem 0' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' },
  logoText: { fontSize: '1.4rem', fontWeight: 'bold', color: '#2d3748' },
  links: { display: 'flex', gap: '1.5rem' },
  link: { textDecoration: 'none', color: '#4a5568', fontWeight: '600', fontSize: '1rem', transition: 'color 0.2s' },
  authSection: { display: 'flex', alignItems: 'center' },
  profile: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' },
  logoutBtn: { background: 'none', border: 'none', color: '#718096', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px' },
  loginBtn: { background: '#ff7a59', color: '#fff', textDecoration: 'none', padding: '0.5rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95rem' }
};

export default Navbar;