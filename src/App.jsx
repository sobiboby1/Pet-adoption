import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, HashRouter, Link, useLocation } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { supabase } from './supabaseClient';
import { Home, PlusCircle, Info, LogOut } from 'lucide-react';

// Import your page components
import Auth from './pages/Auth';
import Adoption from './pages/Adoption';
import About from './pages/About'; 

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // LIVE DATABASE STATE MANAGEMENT
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // LOCAL MODAL CONTROLLER
  const [isRehomeOpen, setIsRehomeOpen] = useState(false);

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
      if (session) {
        fetchPosts();
      } else {
        setLoading(false); // Stop loading if not logged in
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      // Corrected code
fetchPosts(); // Always fetch, regardless of whether a session exists
setLoading(false); // Ensure loading state is turned off
    });

    const setupDeepLinks = async () => {
      await CapApp.addListener('appUrlOpen', async (data) => {
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
    navigate('/adoption'); // Redirect to public feed after logout
  };

  const triggerRehomeModal = () => {
    if (!user) {
      alert("Please sign in to rehome a pet.");
      navigate('/auth');
      return;
    }
    if (location.pathname !== '/adoption') {
      navigate('/adoption');
    }
    setIsRehomeOpen(true);
  };

  return (
    <div className="app-main-container" style={{ paddingTop: showNavbar ? '60px' : '0px', paddingBottom: showNavbar ? '70px' : '0px' }}>
      
      {showNavbar && (
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '60px', backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '0 20px', zIndex: 1000
        }}>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#ff7a59' }}>PetAdopt</span>
          <button onClick={triggerRehomeModal} style={{
            backgroundColor: '#ff7a59', color: '#ffffff', border: 'none', padding: '6px 14px',
            borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <PlusCircle size={16} />
            Rehome a Pet
          </button>
        </header>
      )}

      <Routes>
        {/* Changed root redirect to /adoption */}
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
        {/* Changed catch-all to /adoption */}
        <Route path="*" element={<Navigate to="/adoption" replace />} />
      </Routes>

      {showNavbar && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around',
          alignItems: 'center', zIndex: 1000, padding: '5px 0'
        }}>
          <Link to="/adoption" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: location.pathname === '/adoption' ? '#ff7a59' : '#718096', fontSize: '0.8rem' }}>
            <Home size={22} />
            <span>Home</span>
          </Link>
          <div onClick={triggerRehomeModal} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#718096', fontSize: '0.8rem', cursor: 'pointer' }}>
            <PlusCircle size={22} />
            <span>Rehome</span>
          </div>
          <Link to="/about" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: location.pathname === '/about' ? '#ff7a59' : '#718096', fontSize: '0.8rem' }}>
            <Info size={22} />
            <span>About</span>
          </Link>
          {user ? (
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#e53e3e', fontSize: '0.8rem', cursor: 'pointer' }}>
              <LogOut size={22} />
              <span>Logout</span>
            </button>
          ) : (
            <Link to="/auth" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#ff7a59', fontSize: '0.8rem' }}>
              <LogOut size={22} />
              <span>Login</span>
            </Link>
          )}
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