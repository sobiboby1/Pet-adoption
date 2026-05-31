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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/adoption'
        }
      });
      if (error) throw error;
    } catch (err) {
      toast.error("Authentication failed: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Join PetAdopt</h2>
        <p style={styles.subtitle}>Sign in to browse active listings or find a second home for a pet.</p>
        <button onClick={handleGoogleLogin} style={styles.googleBtn}>
          <LogIn size={20} style={{ marginRight: '10px' }} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' },
  card: { background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%' },
  title: { margin: '0 0 0.5rem 0', color: '#2d3748' },
  subtitle: { color: '#718096', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.4' },
  googleBtn: { background: '#4285F4', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%' }
};

export default Auth;