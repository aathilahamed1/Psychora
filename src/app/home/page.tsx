
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page is now deprecated and redirects to the root page.
// The root page (app/page.tsx) handles displaying the student homepage content.
export default function DeprecatedHomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
}
