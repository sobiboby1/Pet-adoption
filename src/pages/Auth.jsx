import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogIn } from 'lucide-react';
import { toast } from 'react-toastify';
// FIXED: Import the official Capacitor core package to properly detect the native device environment
import { Capacitor } from '@capacitor/core';

function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/adoption');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success("Welcome back!");
        navigate('/adoption');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      // FIXED: Use the correct, foolproof method to see if running as an APK/App
      const isNativeMobile = Capacitor.isNativePlatform();

      // FIXED: Match the base custom scheme ('petadopt://') exactly with your App.jsx listener
      const redirectUrl = isNativeMobile 
        ? 'petadopt://auth/callback' 
        : `${window.location.origin}/adoption`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });
      
      if (error) throw error;
    } catch (err) {
      toast.error("Authentication failed: " + err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Join PetAdopt</h2>
        <p className="auth-subtitle">Sign in to browse active listings or find a second home for a pet.</p>
        <button onClick={handleGoogleLogin} className="auth-google-btn">
          <LogIn size={20} style={{ marginRight: '10px' }} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Auth;