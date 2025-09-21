'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth';

type UseAuthRedirectOptions = {
  requiredAuth: boolean; // Does this page require authentication?
  redirectTo: string;   // Where to redirect if the condition isn't met?
};

export const useAuthRedirect = ({ requiredAuth, redirectTo }: UseAuthRedirectOptions) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait until authentication status is resolved
    }

    const isAuthenticated = !!user;

    // If auth is required but user is not authenticated, redirect
    if (requiredAuth && !isAuthenticated) {
      router.push(redirectTo);
    }

    // If auth is NOT required but user IS authenticated, redirect
    // (e.g., redirect from login page if already logged in)
    if (!requiredAuth && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [user, loading, router, requiredAuth, redirectTo]);
};
