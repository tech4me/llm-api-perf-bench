import React, { createContext, useContext, useState, useEffect } from 'react';
import authClient from './authClient';

// Create a context for authentication
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Function to fetch the session - extracted from useEffect for reusability
  const fetchSession = async () => {
    console.log('Fetching session...');
    setLoading(true);

    try {
      const { data } = await authClient.getSession();
      console.log('Session fetched successfully:', data);
      setSession(data);
      setAuthError(null);
      return data;
    } catch (error) {
      console.error('Error fetching session:', error);
      setSession(null);
      setAuthError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch the initial session on mount
  useEffect(() => {
    let mounted = true;
    let intervalId = null;

    const initialize = async () => {
      try {
        await fetchSession();
      } catch (err) {
        console.error('Initial session fetch failed:', err);
      }

      // Only set up interval if component is still mounted
      if (mounted) {
        // Set up an interval to periodically check the session
        intervalId = setInterval(fetchSession, 5 * 60 * 1000); // Check every 5 minutes
      }
    };

    initialize();

    // Clean up interval on unmount
    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // Sign out the user
  const signOut = async () => {
    console.log('Signing out...');
    setLoading(true);

    try {
      await authClient.signOut();
      console.log('Signed out successfully');
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh the session (used after login/registration)
  const refreshSession = async () => {
    console.log('Refreshing session...');
    return await fetchSession();
  };

  const value = {
    user: session?.user || null,
    session,
    loading,
    error: authError,
    signOut,
    isAuthenticated: !!session?.user,
    refreshSession
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