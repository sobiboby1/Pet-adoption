import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, HashRouter, Link, useLocation } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { supabase } from './supabaseClient';
import { Home, PlusCircle, Info, LogOut } from 'lucide-react';

// Import your page components
import Auth from './pages/Auth';
import Adoption from './pages/Adoption';
import About from './pages/About'; 

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isRehomeOpen, setIsRehomeOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      console.error("Error fetching listings:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      fetchPosts(); 
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      fetchPosts();
      
      // FIX: Ensure clean exit on logout
      if (event === 'SIGNED_OUT') {
        navigate('/auth', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Force redirect to auth on logout
    navigate('/auth', { replace: true });
  };

  const triggerRehomeModal = () => {
    if (!user) {
      alert("Please sign in to rehome a pet!");
      navigate('/auth');
      return;
    }
    setIsRehomeOpen(true);
  };

  const showNavbar = location.pathname !== '/auth';

  return (
    <div style={{ paddingTop: showNavbar ? '65px' : '0px', paddingBottom: (showNavbar && !isDesktop) ? '70px' : '0px' }}>
      
      {showNavbar && (
        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '65px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', zIndex: 1000 }}>
          <Link to="/adoption" style={{ fontWeight: '800', fontSize: '1.4rem', color: '#ff7a59', textDecoration: 'none' }}>PetAdopt</Link>
          
          {user && (
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: '600' }}>
              <LogOut size={16} /> Logout
            </button>
          )}
        </header>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/adoption" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/adoption" element={<Adoption posts={posts} loading={loading} user={user} isRehomeOpen={isRehomeOpen} setIsRehomeOpen={setIsRehomeOpen} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/adoption" replace />} />
      </Routes>

      {showNavbar && !isDesktop && (
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000 }}>
          <Link to="/adoption"><Home size={22} color="#718096" /></Link>
          <div onClick={triggerRehomeModal} style={{ cursor: 'pointer' }}><PlusCircle size={22} color="#718096" /></div>
          <Link to="/about"><Info size={22} color="#718096" /></Link>
        </nav>
      )}
    </div>
  );
}

export default function Root() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}