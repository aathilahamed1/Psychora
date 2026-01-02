
'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowRight, Languages } from 'lucide-react';
import { useI18n } from '@/contexts/i18n';
import { useToast } from '@/hooks/use-toast';
import { HeroGraphic } from '@/components/hero-graphic';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { StudentHomePage } from '@/components/student-home-page';
import { Skeleton } from '@/components/ui/skeleton';

function WelcomeScreen() {
  const { t, setLanguage } = useI18n();
  const { toast } = useToast();

  const handleLanguageChange = (lang: string, langName: string) => {
    setLanguage(lang);
    toast({
      title: t('sidebar.language.switched'),
      description: t('sidebar.language.set', { lang: langName }),
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center text-center p-4">
      <div className="absolute top-4 right-4 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Languages className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => handleLanguageChange('en', 'English')}>
              {t('sidebar.language.english')}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleLanguageChange('hi', 'Hindi')}>
              {t('sidebar.language.hindi')}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleLanguageChange('ks', 'Kashmiri')}>
              {t('sidebar.language.kashmiri')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col items-center">
        <HeroGraphic className="w-32 h-32 mb-6 animate-fade-in-up" />
        <div
          style={{
            textShadow: '0 2px 8px hsl(var(--foreground) / 0.1)',
          }}
          className="animate-fade-in-up animation-delay-200 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          {t('welcome.title')}
        </div>
        <p className="mt-6 max-w-2xl text-lg text-foreground/80 animate-fade-in-up animation-delay-400">
          {t('welcome.description')}
        </p>
        <Link href="/login" passHref className="mt-10">
          <Button size="lg" className="animate-fade-in-up animation-delay-600">
            {t('welcome.button')} <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && (user.role === 'Admin' || user.role === 'Super Admin')) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);


  if (loading) {
    return (
       <div className="flex h-screen w-screen items-center justify-center">
        <Skeleton className="h-screen w-screen" />
       </div>
    );
  }

  if (!user) {
    return <WelcomeScreen />;
  }

  if (user.role === 'Student' || user.role === 'Moderator') {
    return <StudentHomePage />;
  }
  
  // Admins are being redirected, show a loader until then to prevent flashing content
  return (
    <div className="flex h-screen w-screen items-center justify-center">
        <Skeleton className="h-screen w-screen" />
    </div>
  );
}
