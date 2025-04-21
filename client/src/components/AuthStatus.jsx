import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { LogOut } from 'lucide-react';
import { exportMetricsCsv } from '../api';

export function AuthStatus() {
  const { user, loading, signOut, isAuthenticated } = useAuth();

  // Handler to export all metrics as CSV
  const handleExportCsv = async () => {
    try {
      const blob = await exportMetricsCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'metrics.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting metrics:', error);
      alert('Failed to export metrics CSV');
    }
  };

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded bg-gray-200"></div>;
  }

  if (!isAuthenticated) {
    return null; // Don't render anything when not authenticated
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="font-medium">{"User: " + user.name || user.email}</span>
      </div>
      <button
        onClick={handleExportCsv}
        className="rounded-md bg-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-300 border-5 flex items-center gap-1 px-2 py-1"
      >
        Export CSV
      </button>
      <button
        onClick={signOut}
        className="rounded-md bg-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-300 border-5 flex items-center gap-1 px-2 py-1"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  );
}