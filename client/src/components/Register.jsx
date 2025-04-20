import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authClient from '../lib/authClient';
import { useAuth } from '../lib/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Use the Better Auth method for email registration
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/"
      });
      
      if (authError) {
        throw new Error(authError.message || 'Registration failed');
      }
      
      // Refresh session to update auth context
      const sessionData = await refreshSession();
      
      if (!sessionData || !sessionData.user) {
        // If session isn't available yet, wait a bit and try again
        await new Promise(resolve => setTimeout(resolve, 1000));
        const retrySession = await refreshSession();
        
        if (!retrySession || !retrySession.user) {
          throw new Error('Failed to establish session');
        }
      }
      
      // Log success and navigate to home page
      console.log('Registration successful, navigating to home');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">LLM API Performance Bench</h1>
          <h2 className="mt-6 text-xl font-medium">Create your account</h2>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
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
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 