'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, UserRole } from '@/contexts/auth';
import { useI18n } from '@/contexts/i18n';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Logo } from './icons';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export function TopNav() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    router.push('/');
    toast({
      title: t('top.nav.logout.toast.title'),
      description: t('top.nav.logout.toast.description'),
    });
  };

  const isUserAdmin = user?.role === 'Admin' || user?.role === 'Super Admin';
  
  const studentNavLinks = [
    { href: '/', label: t('topnav.home') },
    { href: '/progress', label: t('topnav.progress') },
    { href: '/chat', label: t('topnav.chat') },
    { href: '/booking', label: t('topnav.booking') },
    { href: '/resources', label: t('topnav.resources') },
    { href: '/peer-support', label: t('topnav.peerSupport') },
    { href: '/mindful-games', label: t('topnav.mindfulGames') },
  ];

  const navLinks = isUserAdmin ? [] : studentNavLinks;

  const MobileNav = (
    <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col gap-4 py-6">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className={cn(
                    "text-lg font-semibold transition-colors hover:text-foreground/80",
                    pathname === link.href ? "text-foreground" : "text-foreground/60"
                )}
                >
                {link.label}
                </Link>
            ))}
             {isUserAdmin && (
                <Link
                href="/dashboard"
                className={cn(
                    "text-lg font-semibold transition-colors flex items-center gap-2 hover:text-foreground/80",
                    pathname.startsWith('/dashboard') ? "text-foreground" : "text-foreground/60"
                )}
                >
                <LayoutDashboard className='h-5 w-5' />
                {t('topnav.admin')}
                </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/50 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60'
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          {!isUserAdmin && MobileNav}
          <Link href={isUserAdmin ? "/dashboard" : "/"} className="mx-2 flex items-center space-x-2">
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
          {isUserAdmin && (
            <Link
              href="/dashboard"
              className={cn(
                "relative font-medium transition-colors duration-300 flex items-center gap-2 hover:text-foreground/80 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",
                pathname.startsWith('/dashboard') ? "text-foreground after:scale-x-100 after:origin-bottom-left" : "text-foreground/60"
              )}
            >
              <LayoutDashboard className='h-4 w-4' />
              {t('topnav.admin')}
            </Link>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
            {user && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || undefined} alt={t('top.nav.user.avatar.alt')} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.role}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('topnav.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
        </div>
      </div>
    </header>
  );
}
