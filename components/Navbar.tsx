'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from './Button';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
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
      // Retry once after a short delay
      setTimeout(fetchCsrfToken, 1000);
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
      await fetchCsrfToken(); // Refresh CSRF token on failure
    }
  };

  return (
    <nav className="bg-primary text-black p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          SecureApp
        </Link>
        {pathname !== '/login' && (
          <div className="space-x-4">
            <Link href="/dashboard" className="text-sm hover:underline">
              Dashboard
            </Link>
            <Button onClick={handleLogout} className="btn-secondary">
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}