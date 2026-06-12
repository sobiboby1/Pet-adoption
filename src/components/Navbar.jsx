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
    <nav className="app-nav">
      <div className="nav-container">
        <Link to="/adoption" className="nav-logo">
          <PawPrint size={26} color="#ff7a59" />
          <span className="nav-logo-text">PetAdopt</span>
        </Link>

        <div className="nav-links">
          <Link to="/adoption" className="nav-link">Adoption Feed</Link>
          <Link to="/create" className="nav-link">Rehome a Pet</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>

        <div className="nav-auth-section">
          {user ? (
            <div className="nav-profile">
              <img 
                src={user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                alt="Profile" 
                className="nav-avatar" 
              />
              <button onClick={handleSignOut} className="nav-logout-btn" title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="nav-login-btn">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;