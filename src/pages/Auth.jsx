import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogIn } from 'lucide-react';
import { toast } from 'react-toastify';

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
      // 1. Check if the user is running the app on a native mobile device
      const isNativeMobile = window.Capacitor?.isNative;

      // 2. Set the redirect: Use your production web URL for browsers, 
      // or standard localhost tracking for mobile wrapper interception
      const redirectUrl = isNativeMobile 
        ? 'localhost://adoption' 
        : `${window.location.origin}/adoption`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false
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