'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { Logo } from '../icons';
import { useAuth } from '@/contexts/auth';
import { useI18n } from '@/contexts/i18n';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Google</title>
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.72 1.9-3.86 0-7-3.14-7-7s3.14-7 7-7c2.1 0 3.68.86 4.6 1.78l2.5-2.5C18.1 1.36 15.5.36 12.48.36c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.94 0 11.7-4.8 11.7-11.7 0-.78-.08-1.5-.2-2.2H12.48z"
      fill="currentColor"
    />
  </svg>
);


export function AuthForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useI18n();

  const handleLogin = () => {
    // In a real app, you'd validate credentials here.
    // For this demo, we'll just log in with the default student role.
    login('Student');
    router.push('/home');
  }

  const handleSignUp = () => {
    // In a real app, you would handle the final submission here
    // All new signups default to the 'Student' role.
    login('Student');
    router.push('/home');
  }


  return (
    <Card className="w-full max-w-md animate-fade-in-up glassmorphic-card">
      <Tabs defaultValue="signin">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">{t('auth.signin.tab')}</TabsTrigger>
          <TabsTrigger value="signup">{t('auth.signup.tab')}</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2">
                <Logo className='h-10 w-10'/>
            </div>
            <CardTitle>{t('auth.signin.title')}</CardTitle>
            <CardDescription>{t('auth.signin.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-signin">{t('auth.form.email')}</Label>
              <Input id="email-signin" type="email" placeholder="student@university.edu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-signin">{t('auth.form.password')}</Label>
              <Input id="password-signin" type="password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" onClick={handleLogin}>{t('auth.signin.button')}</Button>
            <Button variant="outline" className="w-full" onClick={handleLogin}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              {t('auth.signin.google')}
            </Button>
          </CardFooter>
        </TabsContent>
        <TabsContent value="signup">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2">
                <Logo className='h-10 w-10'/>
            </div>
            <CardTitle>{t('auth.signup.title')}</CardTitle>
            <CardDescription>
              {t('auth.signup.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name-signup">{t('auth.form.name')}</Label>
              <Input id="name-signup" placeholder="Alex Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-signup">{t('auth.form.email')}</Label>
              <Input id="email-signup" type="email" placeholder="student@university.edu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-signup">{t('auth.form.password')}</Label>
              <Input id="password-signup" type="password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" onClick={handleSignUp}>
              {t('auth.signup.button')}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleSignUp}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              {t('auth.signup.google')}
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
