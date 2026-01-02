
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartPulse, CheckCircle } from 'lucide-react';
import { useI18n } from '@/contexts/i18n';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

const COOLDOWN_PERIOD_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

function getTimeRemaining(endTime: number) {
  const total = endTime - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}


export function WellnessCheckinCountdownCard() {
  const { t } = useI18n();
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number} | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkAvailability = () => {
        const storedResults = localStorage.getItem('wellnessResults');
        if (!storedResults) {
            setIsAvailable(true);
            setTimeLeft(null);
            return;
        }

        const { date } = JSON.parse(storedResults);
        const lastCompletionDate = new Date(date);
        const nextAvailableDate = new Date(lastCompletionDate.getTime() + COOLDOWN_PERIOD_MS);
        
        if (new Date() > nextAvailableDate) {
            setIsAvailable(true);
            setTimeLeft(null);
        } else {
            setIsAvailable(false);
            const remaining = getTimeRemaining(nextAvailableDate.getTime());
            setTimeLeft({ days: remaining.days, hours: remaining.hours, minutes: remaining.minutes });
        }
    }
    
    checkAvailability();
    const timer = setInterval(checkAvailability, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  if (!isClient) {
    return (
        <div className="container px-4 md:px-6">
            <Skeleton className="h-48 w-full max-w-3xl mx-auto glassmorphic-card" />
        </div>
    );
  }
  
  const cardContent = isAvailable ? (
    <>
        <CardHeader className="items-center text-center">
          <HeartPulse className="w-10 h-10 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold">{t('wellnessCheckin.card.unlockedTitle')}</CardTitle>
          <CardDescription>{t('wellnessCheckin.card.description')}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button size="lg" onClick={() => router.push('/wellness-check-in')}>
            {t('wellnessCheckin.card.button')}
          </Button>
        </CardFooter>
    </>
  ) : (
    <>
       <CardHeader className="items-center text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
          <CardTitle className="text-xl font-bold">Check-in Complete!</CardTitle>
          <CardDescription>
            You've completed your check-in. Your next one will be available in:
          </CardDescription>
        </CardHeader>
        <CardContent>
            {timeLeft && (
                 <div className="flex items-baseline justify-center gap-x-4">
                    <div>
                        <span className="text-4xl font-bold">{timeLeft.days}</span>
                        <span className="ml-1 text-muted-foreground">d</span>
                    </div>
                     <div>
                        <span className="text-4xl font-bold">{timeLeft.hours}</span>
                        <span className="ml-1 text-muted-foreground">h</span>
                    </div>
                     <div>
                        <span className="text-4xl font-bold">{timeLeft.minutes}</span>
                        <span className="ml-1 text-muted-foreground">m</span>
                    </div>
                </div>
            )}
        </CardContent>
    </>
  );

  return (
    <div className="container px-4 md:px-6">
      <Card className={cn("max-w-3xl mx-auto glassmorphic-card overflow-hidden animate-fade-in-up transition-all")}>
            {cardContent}
      </Card>
    </div>
  );
}
