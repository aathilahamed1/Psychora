
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TopNav } from '@/components/top-nav';
import { useAuth } from '@/contexts/auth';

export function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect to /login if not authenticated and trying to access a protected page
  useEffect(() => {
    if (loading) return;

    // List of pages that do not require authentication
    const publicPages = ['/', '/login'];

    // If the user is not logged in and is not on a public page, redirect them.
    if (!user && !publicPages.includes(pathname)) {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  // Determine if the navigation shell should be visible
  const isStudentHomePage = !!user && (user.role === 'Student' || user.role === 'Moderator') && pathname === '/';
  const noShellPages = ['/login'];
  
  // A page should have the shell if the user is logged in AND it's not a "no shell" page.
  // The root welcome page for logged-out users should not have a shell.
  const shouldShowShell = !loading && !!user && !noShellPages.includes(pathname);
  

  if (loading && !['/', '/login'].includes(pathname)) {
     // If loading on a protected page, show nothing to prevent content flashing.
     return null;
  }

  if (shouldShowShell) {
    return (
      <div className="relative z-10 flex flex-col h-screen">
        <TopNav />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    );
  }

  return <main>{children}</main>;
}
