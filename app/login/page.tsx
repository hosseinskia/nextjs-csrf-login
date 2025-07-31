'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Header from '../../components/Header';

const schema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [csrfToken, setCsrfToken] = useState('');
  const isMounted = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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

  const onSubmit = async (data: FormData) => {
    if (!csrfToken) {
      toast.error('Security token not initialized');
      console.error('No CSRF token available for submission');
      return;
    }
    try {
      const response = await axios.post(
        '/api/login',
        { email: data.email, password: data.password },
        {
          withCredentials: true,
          headers: { 'X-CSRF-Token': csrfToken },
        }
      );
      if (response.status === 200) {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An error occurred during login';
      toast.error(errorMessage);
      console.error('Login error:', err.message, err.response?.data);
      if (err.response?.status === 401) {
        reset({ email: '', password: '' }); // Clear form on invalid credentials
      }
      await fetchCsrfToken(); // Fetch new CSRF token on any error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <Header
          heading="Sign In to SecureApp"
          paragraph="Don't have an account?"
          linkName="Sign Up"
          linkUrl="#"
        />
        <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-6">
          <Input
            id="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            register={register('email')}
            error={errors.email?.message}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            register={register('password')}
            error={errors.password?.message}
          />
          <Button
            type="submit"
            className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition duration-300 w-full shadow-md"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}