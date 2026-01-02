
'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
        const destination = (user.role === 'Admin' || user.role === 'Super Admin') ? '/dashboard' : '/';
        router.replace(destination);
    }
  }, [user, loading, router])

  if (loading || user) {
    return null; // or a loading skeleton
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
