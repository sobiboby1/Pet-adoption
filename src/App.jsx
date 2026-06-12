import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, HashRouter, Link, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Home, PlusCircle, Info, LogOut } from 'lucide-react';
import Auth from './pages/Auth';
import Adoption from './pages/Adoption';
import About from './pages/About';

function AppContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      fetchPosts();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/adoption" replace />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/adoption" element={<Adoption posts={posts} loading={loading} />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}