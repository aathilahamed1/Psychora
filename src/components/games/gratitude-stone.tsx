
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18n';
import { Textarea } from '../ui/textarea';
import { useStreak } from '@/hooks/use-streak';

export function GratitudeStoneGame({ onComplete }: { onComplete: () => void; }) {
    const { t } = useI18n();
    const { hasPlayedToday, secureStreak } = useStreak('gratitude-stone');
    const [gratitude, setGratitude] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);

    const wasPlayedBeforeThisSession = hasPlayedToday && !isFinished;

    const handleSubmit = () => {
        if (!gratitude.trim()) return;
        if (!wasPlayedBeforeThisSession) {
            secureStreak();
        }
        setIsFinished(true);
    };
    
    if (showInstructions) {
        return (
            <Card className="w-full max-w-md text-center glassmorphic-card">
                <CardHeader>
                    <CardTitle>{t('games.gratitudeStone.title')}</CardTitle>
                    <CardDescription>{t('games.gratitudeStone.instructions')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => setShowInstructions(false)}>{t('games.gratitudeStone.start')}</Button>
                </CardContent>
            </Card>
        );
    }
    
    if (isFinished) {
        return (
             <Card className="w-full max-w-md text-center glassmorphic-card">
                <CardHeader>
                    <CardTitle>{t(wasPlayedBeforeThisSession ? 'games.gratitudeStone.completion.subsequent.title' : 'games.gratitudeStone.completion.first.title')}</CardTitle>
                    <CardDescription>{t(wasPlayedBeforeThisSession ? 'games.gratitudeStone.completion.subsequent.description' : 'games.gratitudeStone.completion.first.description')}</CardDescription>
                </CardHeader>
                 <CardContent className='flex justify-center'>
                    <div className="relative flex items-center justify-center p-8">
                        <svg viewBox="0 0 200 100" className="w-48 h-24 filter drop-shadow-lg">
                            <path d="M 50 0 C -20 0, -20 100, 50 100 L 150 100 C 220 100, 220 0, 150 0 Z" fill="hsl(var(--primary) / 0.2)" />
                        </svg>
                        <span className="absolute text-center font-semibold text-foreground break-words p-4">{gratitude}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={onComplete} className="w-full">{t('games.hub.back')}</Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md text-center glassmorphic-card">
            <CardHeader>
                 <CardTitle>{t('games.gratitudeStone.prompt.title')}</CardTitle>
                 <CardDescription>{t('games.gratitudeStone.prompt.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea 
                    value={gratitude}
                    onChange={(e) => setGratitude(e.target.value)}
                    placeholder={t('games.gratitudeStone.prompt.placeholder')}
                    className='bg-transparent min-h-24'
                    maxLength={50}
                />
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} disabled={!gratitude.trim()} className="w-full">
                    {t('games.gratitudeStone.submit')}
                </Button>
            </CardFooter>
        </Card>
    );
}
