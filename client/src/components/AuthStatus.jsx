import React from 'react';
import { useAuth } from '../lib/AuthContext';

export function AuthStatus() {
  const { user, loading, signOut, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded bg-gray-200"></div>;
  }

  if (!isAuthenticated) {
    return null; // Don't render anything when not authenticated
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.image && (
          <img
            src={user.image}
            alt={user.name || user.email}
            className="rounded-full max-w-[100px] h-auto object-scale-down"
          />
        )}
        <span className="font-medium">{user.name || user.email}</span>
      </div>
      <button
        onClick={signOut}
        className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
      >
        Sign out
      </button>
    </div>
  );
}