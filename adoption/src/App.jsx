import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from "@vercel/analytics/react"

import Navbar from './components/Navbar';
import Adoption from './pages/Adoption';
import CreatePost from './pages/CreatePost';
import Auth from './pages/Auth';
import TermsAndConditions from './pages/TermsAndConditions';
import LegalDocs from './pages/LegalDocs';
import About from './pages/About';

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
          {/* Base Redirect */}
          <Route path="/" element={<Navigate to="/adoption" replace />} />
          
          {/* Main Adoption Feed */}
          <Route 
            path="/adoption" 
            element={<Adoption posts={posts} loading={loading} user={user} refreshPosts={fetchPosts} />} 
          />
          
          {/* Auth Route */}
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/adoption" replace />} />
          
          {/* Create Post Route */}
          <Route 
            path="/create" 
            element={user ? <CreatePost user={user} refreshPosts={fetchPosts} /> : <Navigate to="/auth" replace />} 
          />

         
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<TermsAndConditions />} />
           <Route path="/legal" element={<LegalDocs />} />   
     </Routes>
         

        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
        
        {/* Vercel Analytics tracking component */}
        <Analytics />
      </div>
    </Router>
  );
}

export default App;