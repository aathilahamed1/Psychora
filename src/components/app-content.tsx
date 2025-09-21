
'use client';

import { usePathname } from 'next/navigation';
import { TopNav } from '@/components/top-nav';
import { useAuth } from '@/contexts/auth';

export function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const noShellPages = ['/', '/login'];
  const showShell = !noShellPages.includes(pathname);

  // This prevents a flash of the shell on pages where it shouldn't be visible
  // while auth state is loading.
  if (loading && !showShell) {
    return <main>{children}</main>;
  }

  if (showShell) {
    return (
      <div className="relative z-10 flex flex-col h-screen">
        <TopNav />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    );
  }

  // For pages like login/welcome, no special layout is needed as the
  // root layout already has the necessary background elements.
  return <main>{children}</main>;
}
