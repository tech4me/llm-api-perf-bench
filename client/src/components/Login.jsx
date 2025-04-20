import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import authClient from '../lib/authClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshSession, loading: authLoading } = useAuth();
  
  // Get the url to redirect to after login, or default to "/"
  const from = location.state?.from?.pathname || "/";
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLocalLoading(true);
    
    try {
      console.log('Starting login process...');
      
      // Use the Better Auth method for email login
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: from,
        rememberMe: true
      });
      
      console.log('Sign in response:', { data, authError });
      
      if (authError) {
        throw new Error(authError.message || 'Authentication failed');
      }
      
      // Small delay to ensure server has processed the login
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh session to update auth context
      console.log('Refreshing session after login...');
      const sessionData = await refreshSession();
      console.log('Session refresh result:', sessionData);
      
      if (!sessionData || !sessionData.user) {
        // If session isn't available yet, wait and try again
        console.log('Session not immediately available, retrying...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        const retrySession = await refreshSession();
        console.log('Retry session result:', retrySession);
        
        if (!retrySession || !retrySession.user) {
          throw new Error('Failed to establish session');
        }
      }
      
      // Log success and navigate to the page user tried to visit
      console.log('Authentication successful, navigating to:', from);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error details:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLocalLoading(false);
    }
  };
  
  // Determine if we're in a loading state
  const isLoading = localLoading || authLoading;
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">LLM API Performance Bench</h1>
          <h2 className="mt-6 text-xl font-medium">Sign in to your account</h2>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 