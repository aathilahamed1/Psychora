'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';

export default function LoginPage() {
  useAuthRedirect({ requiredAuth: false, redirectTo: '/home' });

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
