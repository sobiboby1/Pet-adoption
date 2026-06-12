import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogOut, PawPrint } from 'lucide-react';
import { toast } from 'react-toastify';

function Navbar({ user }) {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Dynamic window listener to switch layouts instantly on desktop vs mobile browser viewports
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out: " + error.message);
    } else {
      toast.success("Signed out successfully");
      navigate('/auth');
    }
  };

  // INLINE RESPONSIVE LAYOUT DEFINITIONS
  const navStyle = {
    background: '#ffffff',
    zIndex: 1000,
    padding: '10px 16px',
    position: 'fixed',
    // If it's desktop browser width, snap to top. If it's mobile view/app layout, snap to bottom!
    top: isDesktop ? '0' : 'auto',
    bottom: isDesktop ? 'auto' : '0',
    left: '0',
    right: '0',
    borderTop: isDesktop ? 'none' : '1px solid #e2e8f0',
    borderBottom: isDesktop ? '1px solid #e2e8f0' : 'none',
    boxShadow: isDesktop ? 'none' : '0 -2px 10px rgba(0,0,0,0.05)',
    height: '65px',
    display: 'flex',
    alignItems: 'center'
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px'
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        
        {/* LOGO */}
        <Link to="/adoption" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <PawPrint size={26} color="#ff7a59" />
          {isDesktop && (
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2d3748' }}>
              PetAdopt
            </span>
          )}
        </Link>

        {/* NAVIGATION LINKS */}
        <div style={{ display: 'flex', gap: isDesktop ? '24px' : '14px', alignItems: 'center' }}>
          <Link to="/adoption" style={{ textDecoration: 'none', color: '#4a5568', fontWeight: '600', fontSize: isDesktop ? '0.95rem' : '0.85rem', whiteSpace: 'nowrap' }}>
            Adoption
          </Link>
          <Link to="/create" style={{ textDecoration: 'none', color: '#4a5568', fontWeight: '600', fontSize: isDesktop ? '0.95rem' : '0.85rem', whiteSpace: 'nowrap' }}>
            Rehome
          </Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#4a5568', fontWeight: '600', fontSize: isDesktop ? '0.95rem' : '0.85rem', whiteSpace: 'nowrap' }}>
            About
          </Link>
        </div>

        {/* AUTH/PROFILE SECTION */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                alt="Profile" 
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} 
              />
              <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', display: 'flex', padding: '4px' }} title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" style={{ background: '#ff7a59', color: '#fff', textDecoration: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: isDesktop ? '0.9rem' : '0.8rem' }}>
              Sign In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;