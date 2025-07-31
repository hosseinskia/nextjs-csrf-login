'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '../../components/Button';

export default function DashboardPage() {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState('');
  const isMounted = useRef(false);

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/api/csrf', { withCredentials: true });
      if (response.data.csrfToken) {
        setCsrfToken(response.data.csrfToken);
      } else {
        toast.error('Failed to initialize security token');
        console.error('CSRF response missing token:', response.data);
      }
    } catch (err: any) {
      toast.error('Failed to initialize security token');
      console.error('CSRF fetch error:', err.message, err.response?.data);
    }
  };

  useEffect(() => {
    if (isMounted.current) return; // Prevent double fetch in Strict Mode
    isMounted.current = true;
    fetchCsrfToken();
    return () => {
      isMounted.current = false; // Cleanup on unmount
    };
  }, []);

  const handleLogout = async () => {
    if (!csrfToken) {
      toast.error('Security token not initialized');
      console.error('No CSRF token available for logout');
      return;
    }
    try {
      await axios.post('/api/logout', {}, {
        withCredentials: true,
        headers: { 'X-CSRF-Token': csrfToken },
      });
      router.push('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Logout failed';
      toast.error(errorMessage);
      console.error('Logout error:', err.message, err.response?.data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Secure Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-indigo-600">Analytics</h3>
            <p className="text-gray-600 mt-2">Track your performance metrics and insights.</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-pink-600">Settings</h3>
            <p className="text-gray-600 mt-2">Customize your account preferences.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-600">Reports</h3>
            <p className="text-gray-600 mt-2">Generate and view detailed reports.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleLogout} className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-700 transition duration-300 shadow-md">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}