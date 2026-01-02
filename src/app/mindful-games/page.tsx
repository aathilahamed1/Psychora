
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/contexts/i18n';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Wind, Sun, CheckCircle } from 'lucide-react';
import { ZenFlowGame } from '@/components/games/zen-flow';
import { BreatheAndBloomGame } from '@/components/games/breathe-and-bloom';
import { GratitudeStoneGame } from '@/components/games/gratitude-stone';
import { useStreak } from '@/hooks/use-streak';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from '@/components/countdown-timer';
import { BackButton } from '@/components/back-button';

export type GameId = 'zen-flow' | 'breathe-bloom' | 'gratitude-stone';

const games: { id: GameId, titleKey: string, descriptionKey: string, instructionsKey: string, icon: React.ReactNode }[] = [
    { id: 'zen-flow', titleKey: 'games.zenFlow.title', descriptionKey: 'games.zenFlow.description', instructionsKey: 'games.zenFlow.instructions', icon: <BrainCircuit className="w-8 h-8 text-primary" /> },
    { id: 'breathe-bloom', titleKey: 'games.breatheBloom.title', descriptionKey: 'games.breatheBloom.description', instructionsKey: 'games.breatheBloom.instructions', icon: <Wind className="w-8 h-8 text-primary" /> },
    { id: 'gratitude-stone', titleKey: 'games.gratitudeStone.title', descriptionKey: 'games.gratitudeStone.description', instructionsKey: 'games.gratitudeStone.instructions', icon: <Sun className="w-8 h-8 text-primary" /> },
];

function GameCard({ game, onPlay }: { game: typeof games[0], onPlay: (id: GameId) => void }) {
    const { t } = useI18n();
    const { streak, hasPlayedToday } = useStreak(game.id);

    return (
        <Card
            className={cn(
                `transform-gpu transition-all duration-300 ease-in-out flex flex-col animate-fade-in-up glassmorphic-card`,
                hasPlayedToday && 'opacity-70'
            )}
        >
            <CardHeader className="items-center text-center">
                {game.icon}
                <CardTitle className="font-bold text-xl leading-snug pt-2 flex items-center gap-2">
                    {t(game.titleKey)}
                    {hasPlayedToday && <CheckCircle className="w-5 h-5 text-green-500" />}
                </CardTitle>
                 {streak > 0 && (
                     <Badge variant="secondary" className="text-base py-1 px-3">
                        ❄️ {streak} {t(streak === 1 ? 'games.hub.streak.day' : 'games.hub.streak.days')}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="flex-grow text-center">
                 <p className="text-sm text-muted-foreground">
                    {t(game.instructionsKey)}
                </p>
                 {hasPlayedToday && (
                    <div className="mt-4 p-2 bg-muted/50 rounded-lg">
                        <p className="text-sm font-semibold text-foreground">{t('games.hub.completed')}</p>
                        <p className="text-xs text-muted-foreground">
                            {t('games.hub.unlocksIn')} <CountdownTimer />
                        </p>
                    </div>
                )}
            </CardContent>
            <CardFooter className='flex-col gap-2'>
                <Button className="w-full" onClick={() => onPlay(game.id)} disabled={hasPlayedToday}>
                    {t('games.hub.play')}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default function MindfulGamesPage() {
    const { t } = useI18n();
    const [activeGame, setActiveGame] = useState<GameId | null>(null);

    const renderGame = () => {
        if (!activeGame) return null;
        
        const onComplete = () => setActiveGame(null);

        switch (activeGame) {
            case 'zen-flow':
                return <ZenFlowGame onComplete={onComplete} />;
            case 'breathe-bloom':
                return <BreatheAndBloomGame onComplete={onComplete} />;
            case 'gratitude-stone':
                return <GratitudeStoneGame onComplete={onComplete} />;
            default:
                return null;
        }
    };

    if (activeGame) {
        return (
            <div className="flex-1 p-4 sm:p-8 flex items-center justify-center relative">
                <BackButton href="/mindful-games" />
                {renderGame()}
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-4 sm:p-8 relative">
            <BackButton />
            <div className="text-center space-y-4 pt-12 sm:pt-0">
                <h1 className="text-3xl font-bold tracking-tight">
                    {t('games.hub.title')}
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('games.hub.description')}
                </p>
            </div>

            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {games.map((game) => (
                    <GameCard 
                        key={game.id}
                        game={game}
                        onPlay={setActiveGame}
                    />
                ))}
            </div>
        </div>
    );
}
