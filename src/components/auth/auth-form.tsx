'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useAuth, UserRole } from '@/contexts/auth';
import { useI18n } from '@/contexts/i18n';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SigninForm = z.infer<typeof signinSchema>;
type SignupForm = z.infer<typeof signupSchema>;

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
  const { user } = useAuth();
  const { t } = useI18n();

  const signinForm = useForm<SigninForm>({ resolver: zodResolver(signinSchema) });
  const signupForm = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const handleLogin = async (data: SigninForm) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, data.email, data.password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  const handleSignUp = async (data: SignupForm) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password);
      // Update display name
      await updateProfile(userCredential.user, { displayName: data.name });
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign-up error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      console.log('Google sign-in user:', user);
      router.push('/dashboard'); // Redirect after login
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

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
              <Logo className="h-10 w-10" />
            </div>
            <CardTitle>{t('auth.signin.title')}</CardTitle>
            <CardDescription>{t('auth.signin.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-signin">{t('auth.form.email')}</Label>
              <Input id="email-signin" type="email" placeholder="student@university.edu" {...signinForm.register('email')} />
              {signinForm.formState.errors.email && <p className="text-red-500 text-sm">{signinForm.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-signin">{t('auth.form.password')}</Label>
              <Input id="password-signin" type="password" {...signinForm.register('password')} />
              {signinForm.formState.errors.password && <p className="text-red-500 text-sm">{signinForm.formState.errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" onClick={signinForm.handleSubmit(handleLogin)} disabled={!signinForm.formState.isValid}>{t('auth.signin.button')}</Button>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              {t('auth.signin.google')}
            </Button>
          </CardFooter>
        </TabsContent>
        <TabsContent value="signup">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2">
              <Logo className="h-10 w-10" />
            </div>
            <CardTitle>{t('auth.signup.title')}</CardTitle>
            <CardDescription>
              {t('auth.signup.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name-signup">{t('auth.form.name')}</Label>
              <Input id="name-signup" placeholder="Alex Doe" {...signupForm.register('name')} />
              {signupForm.formState.errors.name && <p className="text-red-500 text-sm">{signupForm.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-signup">{t('auth.form.email')}</Label>
              <Input id="email-signup" type="email" placeholder="alex@university.edu" {...signupForm.register('email')} />
              {signupForm.formState.errors.email && <p className="text-red-500 text-sm">{signupForm.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-signup">{t('auth.form.password')}</Label>
              <Input id="password-signup" type="password" {...signupForm.register('password')} />
              {signupForm.formState.errors.password && <p className="text-red-500 text-sm">{signupForm.formState.errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" onClick={signupForm.handleSubmit(handleSignUp)} disabled={!signupForm.formState.isValid}>
              {t('auth.signup.button')}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              {t('auth.signup.google')}
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
