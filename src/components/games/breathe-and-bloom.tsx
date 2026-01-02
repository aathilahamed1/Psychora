
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18n';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { useStreak } from '@/hooks/use-streak';

const CYCLE_COUNT = 5;

export function BreatheAndBloomGame({ onComplete }: { onComplete: () => void; }) {
    const { t } = useI18n();
    const { hasPlayedToday, secureStreak } = useStreak('breathe-bloom');
    const [isBreathingIn, setIsBreathingIn] = useState(true);
    const [isHolding, setIsHolding] = useState(false);
    const [cycles, setCycles] = useState(0);
    const [showInstructions, setShowInstructions] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    
    const wasPlayedBeforeThisSession = hasPlayedToday;

    useEffect(() => {
        if (showInstructions || isFinished) return;

        if (cycles >= CYCLE_COUNT) {
            if (!wasPlayedBeforeThisSession) {
                secureStreak();
            }
            setIsFinished(true);
            return;
        }

        const phaseTimer = setTimeout(() => {
            setIsHolding(true);
            const holdTimer = setTimeout(() => {
                setIsBreathingIn(!isBreathingIn);
                setIsHolding(false);
                if (isBreathingIn) {
                    setCycles(c => c + 0.5);
                } else {
                     setCycles(c => c + 0.5);
                }
            }, 2000); // 2 second hold
            return () => clearTimeout(holdTimer);
        }, 4000); // 4 seconds for inhale/exhale

        return () => clearTimeout(phaseTimer);
    }, [isBreathingIn, cycles, showInstructions, isFinished, secureStreak, wasPlayedBeforeThisSession]);

    if (showInstructions) {
        return (
            <Card className="w-full max-w-md text-center glassmorphic-card">
                <CardHeader>
                    <CardTitle>{t('games.breatheBloom.title')}</CardTitle>
                    <CardDescription>{t('games.breatheBloom.instructions')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => setShowInstructions(false)}>{t('games.breatheBloom.start')}</Button>
                </CardContent>
            </Card>
        );
    }
    
    if (isFinished) {
        return (
             <Card className="w-full max-w-md text-center glassmorphic-card">
                <CardHeader>
                    <CardTitle>{t(wasPlayedBeforeThisSession ? 'games.breatheBloom.completion.subsequent.title' : 'games.breatheBloom.completion.first.title')}</CardTitle>
                    <CardDescription>{t(wasPlayedBeforeThisSession ? 'games.breatheBloom.completion.subsequent.description' : 'games.breatheBloom.completion.first.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={onComplete}>{t('games.hub.back')}</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md text-center glassmorphic-card">
            <CardHeader>
                <CardTitle className="text-2xl">
                    {isHolding ? t('games.breatheBloom.hold') : (isBreathingIn ? t('games.breatheBloom.breatheIn') : t('games.breatheBloom.breatheOut'))}
                </CardTitle>
                <CardDescription>
                    {t('games.breatheBloom.cycles', { completed: Math.floor(cycles), total: CYCLE_COUNT })}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-48">
                <div className="relative w-40 h-40">
                     <div className={cn(
                        "absolute inset-0 rounded-full bg-primary/20 transition-transform duration-[4000ms] ease-in-out",
                        isBreathingIn && !isHolding ? "scale-100" : "scale-50"
                     )}></div>
                     <div className={cn(
                        "absolute inset-5 rounded-full bg-primary/40 transition-transform duration-[4000ms] ease-in-out",
                        isBreathingIn && !isHolding ? "scale-100" : "scale-50"
                     )}></div>
                      <div className={cn(
                        "absolute inset-10 rounded-full bg-primary transition-transform duration-[4000ms] ease-in-out",
                         isBreathingIn && !isHolding ? "scale-100" : "scale-50"
                     )}></div>
                </div>
            </CardContent>
            <CardFooter>
                <Progress value={(cycles / CYCLE_COUNT) * 100} className="w-full" />
            </CardFooter>
        </Card>
    );
}
