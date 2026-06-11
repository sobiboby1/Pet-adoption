import { createClient } from '@supabase/supabase-js';
import { Preferences } from '@capacitor/preferences'; 

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safe check to see if the app is running natively on a mobile phone wrapper
const isNativeMobile = window.Capacitor?.isNative;

// Hybrid storage adapter: Uses native phone storage on mobile, localStorage on the web browser
const customHybridStorage = {
  getItem: async (key) => {
    if (isNativeMobile) {
      const { value } = await Preferences.get({ key });
      return value;
    }
    return localStorage.getItem(key);
  },
  setItem: async (key, value) => {
    if (isNativeMobile) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  },
  removeItem: async (key) => {
    if (isNativeMobile) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customHybridStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true // Fixed: Allows Supabase to intercept and process authentication details natively inside the app
  }
});