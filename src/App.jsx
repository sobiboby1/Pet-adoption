import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, HashRouter, Link, useLocation } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { supabase } from './supabaseClient';
import { Home, PlusCircle, Info, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // LIVE DATABASE STATE MANAGEMENT
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // LOCAL MODAL CONTROLLER
  const [isRehomeOpen, setIsRehomeOpen] = useState(false);

  // RESPONSIVE SCREEN DETECTOR
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showNavbar = location.pathname !== '/auth';

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Error fetching listings from Supabase:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      fetchPosts(); // Public users can view listings without being forced to log in
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      fetchPosts();
    });

    const setupDeepLinks = async () => {
      await CapApp.addListener('appUrlOpen', async (data) => {
        console.log("Incoming Deep Link URL:", data.url);

        if (data.url.startsWith('petadopt://')) {
          const urlString = data.url.replace('petadopt://', 'https://localhost/');
          const url = new URL(urlString);
          
          const hash = url.hash.substring(1);
          const hashParams = new URLSearchParams(hash);
          const searchParams = url.searchParams;
          
          const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error) {
              await fetchPosts();
              navigate('/adoption');
            }
          }
        }
      });
    };

    setupDeepLinks();

    return () => {
      subscription.unsubscribe();
      CapApp.removeAllListeners();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  // STRICT AUTH PROTECTION ON REHOME BUTTONS
  const triggerRehomeModal = () => {
    if (!user) {
      toast.error("Please sign in to list a pet for rehoming!");
      navigate('/auth');
      return;
    }

    if (location.pathname !== '/adoption') {
      navigate('/adoption');
    }
    setIsRehomeOpen(true);
  };

  return (
    <div 
      className="app-main-container" 
      style={{ 
        paddingTop: showNavbar ? '65px' : '0px', 
        paddingBottom: (showNavbar && !isDesktop) ? '70px' : '0px' 
      }}
    >
      
      {/* --- RESPONSIVE TOP HEADER --- */}
      {showNavbar && (
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '65px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          zIndex: 1000
        }}>
          {/* Logo Brand Title */}
          <Link to="/adoption" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontWeight: '800', fontSize: '1.4rem', color: '#ff7a59' }}>PetAdopt</span>
          </Link>
          
          {/* DESKTOP EXCLUSIVE LINK TABS */}
          {isDesktop && (
            <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
              <Link to="/adoption" style={{ textDecoration: 'none', color: location.pathname === '/adoption' ? '#ff7a59' : '#4a5568', fontWeight: '600', fontSize: '0.95rem' }}>Adoption Feed</Link>
              <span onClick={triggerRehomeModal} style={{ cursor: 'pointer', color: '#4a5568', fontWeight: '600', fontSize: '0.95rem' }}>Rehome a Pet</span>
              <Link to="/about" style={{ textDecoration: 'none', color: location.pathname === '/about' ? '#ff7a59' : '#4a5568', fontWeight: '600', fontSize: '0.95rem' }}>About Us</Link>
            </div>
          )}

          {/* User Account Corner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                  alt="Profile" 
                  style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid #e2e8f0', objectFit: 'cover' }} 
                />
                {isDesktop && (
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', fontSize: '0.9rem' }}>
                    <LogOut size={16} /> Logout
                  </button>
                )}
              </div>
            ) : (
              <Link to="/auth" style={{ backgroundColor: '#ff7a59', color: '#ffffff', textDecoration: 'none', padding: '8px 18px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>
                Sign In
              </Link>
            )}
          </div>
        </header>
      )}

      {/* --- APP PAGES INDEX ROUTER --- */}
      <Routes>
        <Route path="/" element={<Navigate to="/adoption" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/adoption" 
          element={
            <Adoption 
              posts={posts} 
              loading={loading} 
              user={user} 
              refreshPosts={fetchPosts}
              isRehomeOpen={isRehomeOpen}
              setIsRehomeOpen={setIsRehomeOpen} 
            />
          } 
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/adoption" replace />} />
      </Routes>

      {/* --- MOBILE EXCLUSIVE BOTTOM NAV (HIDDEN ON DESKTOP SCREEN RESOLUTIONS) --- */}
      {showNavbar && !isDesktop && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1000,
          padding: '5px 0'
        }}>
          <Link to="/adoption" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: location.pathname === '/adoption' ? '#ff7a59' : '#718096', fontSize: '0.8rem' }}>
            <Home size={22} />
            <span>Home</span>
          </Link>
          
          <div 
            onClick={triggerRehomeModal}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#718096', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            <PlusCircle size={22} />
            <span>Rehome</span>
          </div>
          
          <Link to="/about" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: location.pathname === '/about' ? '#ff7a59' : '#718096', fontSize: '0.8rem' }}>
            <Info size={22} />
            <span>About</span>
          </Link>

          <button onClick={handleLogout} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#e53e3e', fontSize: '0.8rem', cursor: 'pointer' }}>
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        </nav>
      )}
    </div>
  );
}

export default function Root() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}