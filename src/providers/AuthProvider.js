import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [bootstrapped, setBootstrapped] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges((nextUser) => {
      setUser(nextUser);
      setBootstrapped(true);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      bootstrapped,
      setBootstrapped,
      user,
      async signIn(credentials) {
        const authenticatedUser = await authService.signIn(credentials);
        setUser(authenticatedUser);
        return authenticatedUser;
      },
      async register(payload) {
        const registeredUser = await authService.register(payload);
        setUser(registeredUser);
        return registeredUser;
      },
      async signOut() {
        await authService.signOut();
        setUser(null);
      },
    }),
    [bootstrapped, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
