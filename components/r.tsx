'use client';

import { useState } from 'react';

const RefreshButton = () => {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      const data = await res.json();
      if (data.success) {
        console.log('✅ Token refreshed:', data.token.slice(0, 20) + '...');
        alert('Token refreshed successfully!');
      } else {
        console.warn('⚠️ Refresh failed:', data.message);
        alert('Refresh failed: ' + data.message);
      }
    } catch (err) {
      console.error('❌ Refresh request error:', err);
      alert('Refresh error, check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
    >
      {loading ? 'Refreshing...' : 'Refresh Token'}
    </button>
  );
};

export default RefreshButton;
