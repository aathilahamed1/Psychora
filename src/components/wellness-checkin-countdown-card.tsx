'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, HeartPulse } from 'lucide-react';
import { useI18n } from '@/contexts/i18n';
import { cn } from '@/lib/utils';


function calculateTimeUntilUnlock() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const unlockStartDate = new Date(currentYear, currentMonth, 8);
    const unlockEndDate = new Date(currentYear, currentMonth, 15); // Day 15 at 00:00

    // If we are already past the unlock window for this month, target next month
    if (now >= unlockEndDate) {
        unlockStartDate.setMonth(currentMonth + 1);
        if (unlockStartDate.getMonth() !== (currentMonth + 1) % 12) {
            // Handle year wrap-around
            unlockStartDate.setFullYear(currentYear + 1);
            unlockStartDate.setMonth(0); // January
        }
    }
    
    // If we are currently in the unlock window
    if (now >= unlockStartDate && now < unlockEndDate) {
        return { isUnlocked: true, diff: 0 };
    }

    const diff = unlockStartDate.getTime() - now.getTime();
    return { isUnlocked: false, diff };
}

function formatTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    return {
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
    };
}


export function WellnessCheckinCountdownCard() {
  const { t } = useI18n();
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00'});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const { isUnlocked: initialUnlock, diff } = calculateTimeUntilUnlock();

    if (initialUnlock) {
      setIsUnlocked(true);
      return;
    }

    setTimeLeft(formatTime(diff));

    const timer = setInterval(() => {
      const { isUnlocked, diff } = calculateTimeUntilUnlock();
      if (isUnlocked) {
        setIsUnlocked(true);
        clearInterval(timer);
      } else {
        setTimeLeft(formatTime(diff));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isClient) {
    return null; // Avoid SSR rendering mismatch
  }
  
  const cardContent = isUnlocked ? (
    <>
      <div className="p-6">
        <CardHeader>
          <HeartPulse className="w-10 h-10 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold">{t('wellnessCheckin.card.unlockedTitle')}</CardTitle>
          <CardDescription>{t('wellnessCheckin.card.description')}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="lg" onClick={() => router.push('/wellness-check-in')}>
            {t('wellnessCheckin.card.button')}
          </Button>
        </CardFooter>
      </div>
      <div className="hidden md:block bg-primary/10 h-full p-8">
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-primary/70 italic">"The greatest wealth is health."</p>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="p-6">
        <CardHeader>
          <Lock className="w-10 h-10 text-muted-foreground mb-2" />
          <CardTitle className="text-lg font-semibold text-muted-foreground">{t('wellnessCheckin.card.lockedTitle')}</CardTitle>
          <div className="flex items-baseline justify-center gap-2 pt-2">
            <div className="text-4xl font-bold tracking-tighter">{timeLeft.days}</div><span className="text-xs text-muted-foreground">DAYS</span>
            <div className="text-4xl font-bold tracking-tighter">{timeLeft.hours}</div><span className="text-xs text-muted-foreground">HRS</span>
            <div className="text-4xl font-bold tracking-tighter">{timeLeft.minutes}</div><span className="text-xs text-muted-foreground">MIN</span>
            <div className="text-4xl font-bold tracking-tighter">{timeLeft.seconds}</div><span className="text-xs text-muted-foreground">SEC</span>
          </div>
        </CardHeader>
        <CardFooter className="flex-col">
            <p className="text-sm text-muted-foreground text-center">{t('wellnessCheckin.card.lockedDescription')}</p>
        </CardFooter>
      </div>
      <div className="hidden md:block bg-muted/30 h-full">
         <div className="flex items-center justify-center h-full">
         </div>
      </div>
    </>
  );

  return (
    <div className="container px-4 md:px-6 my-12 md:my-16">
      <Card className={cn("glassmorphic-card overflow-hidden animate-fade-in-up transition-all", !isUnlocked && "bg-muted/30")}>
        <div className="grid md:grid-cols-2 items-center">
            {cardContent}
        </div>
      </Card>
    </div>
  );
}
