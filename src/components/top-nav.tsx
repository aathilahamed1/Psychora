
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
import { useI18n } from '@/contexts/i18n';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Logo } from './icons';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';


export function TopNav() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const navLinks = [
    { href: '/home', label: t('topnav.home') },
    { href: '/chat', label: t('topnav.chat') },
    { href: '/booking', label: t('topnav.booking') },
    { href: '/resources', label: t('topnav.resources') },
    { href: '/peer-support', label: t('topnav.peerSupport') },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };
  
  const hasAdminRights = user?.role === 'Admin' || user?.role === 'Super Admin';
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/50 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60'
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/home" className="mr-6 flex items-center space-x-2">
            <Logo className="h-7 w-7" />
            <span className="font-bold text-lg hidden sm:inline-block">Psychora</span>
          </Link>
        </div>
        
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative font-medium transition-colors duration-300 hover:text-foreground/80 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",
                pathname === link.href ? "text-foreground after:scale-x-100 after:origin-bottom-left" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
          {hasAdminRights && (
            <Link
              href="/dashboard"
              className={cn(
                "relative font-medium transition-colors duration-300 hover:text-foreground/80 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",
                pathname === '/dashboard' ? "text-foreground after:scale-x-100 after:origin-bottom-left" : "text-foreground/60"
              )}
            >
              {t('topnav.admin')}
            </Link>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
            {user && (
              <>
                <Avatar className="h-9 w-9">
                  {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint} />}
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('topnav.logout')}
                </Button>
              </>
            )}
        </div>
      </div>
    </header>
  );
}
