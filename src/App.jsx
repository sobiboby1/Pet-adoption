import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component Imports
import Navbar from './components/Navbar';
import Adoption from './pages/Adoption';
import CreatePost from './pages/CreatePost';
import Auth from './pages/Auth';

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
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
      toast.error("Failed to load adoption feed updates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: 'sans-serif' }}>
       
        <Navbar user={user} />
        
      
        <Routes>
         
          <Route path="/" element={<Navigate to="/adoption" replace />} />
          
          
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/adoption" replace />} />
          
       
          <Route 
            path="/adoption" 
            element={<Adoption posts={posts} loading={loading} user={user} refreshPosts={fetchPosts} />} 
          />
          
          
          <Route 
            path="/create" 
            element={user ? <CreatePost user={user} refreshPosts={fetchPosts} /> : <Navigate to="/auth" replace />} 
          />
        </Routes>

        
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </Router>
  );
}

export default App;