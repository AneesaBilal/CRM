import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext<any>(null);

export function AuthProvider(props: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(function (result: any) {
      setUser(result.data.session ? result.data.session.user : null);
      setLoading(false);
    });

    const listener = supabase.auth.onAuthStateChange(function (_event: any, session: any) {
      setUser(session ? session.user : null);
    });

    return function () {
      if (listener && listener.data && listener.data.subscription) {
        listener.data.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user: user, loading: loading }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
