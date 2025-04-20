import React, { createContext, useContext, useState, useEffect } from 'react';
import authClient from './authClient';

// Create a context for authentication
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // Fetch the current user on component mount and set up session management
  useEffect(() => {
    // Initialize session state
    const fetchSession = async () => {
      try {
        // Use Better Auth's session management
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (error) {
        console.error('Error fetching session:', error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Set up an interval to periodically check the session
    const intervalId = setInterval(fetchSession, 5 * 60 * 1000); // Check every 5 minutes

    // Clean up interval
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Sign out the user
  const signOut = async () => {
    try {
      // Use Better Auth's client API to sign out
      await authClient.signOut();
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user: session?.user || null,
    session,
    loading,
    signOut,
    isAuthenticated: !!session?.user,
    refreshSession: async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
        return data;
      } catch (error) {
        console.error('Error refreshing session:', error);
        return null;
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 