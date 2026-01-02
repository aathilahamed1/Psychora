
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { useI18n } from '@/contexts/i18n';
import type { GameId } from '@/app/mindful-games/page';


type StreakInfo = {
    currentStreak: number;
    lastPlayedDate: string; // ISO date string (YYYY-MM-DD)
};

const STREAK_REWARDS = [
    { days: 366, titleKey: 'streaks.celestial.title', descriptionKey: 'streaks.celestial.description'},
    { days: 201, titleKey: 'streaks.mindfulMaster.title', descriptionKey: 'streaks.mindfulMaster.description'},
    { days: 101, titleKey: 'streaks.groveKeeper.title', descriptionKey: 'streaks.groveKeeper.description'},
    { days: 61, titleKey: 'streaks.zenith.title', descriptionKey: 'streaks.zenith.description'},
    { days: 31, titleKey: 'streaks.sunChaser.title', descriptionKey: 'streaks.sunChaser.description'},
    { days: 16, titleKey: 'streaks.flourisher.title', descriptionKey: 'streaks.flourisher.description'},
    { days: 8, titleKey: 'streaks.seedling.title', descriptionKey: 'streaks.seedling.description'},
    { days: 2, titleKey: 'streaks.sprout.title', descriptionKey: 'streaks.sprout.description'},
];

export function useStreak(gameId: GameId) {
    const { t } = useI18n();
    const { toast } = useToast();
    const [streakInfo, setStreakInfo] = useState<StreakInfo>({ currentStreak: 0, lastPlayedDate: '' });
    const [isClient, setIsClient] = useState(false);
    const storageKey = `mindfulStreak-${gameId}`;

    useEffect(() => {
        setIsClient(true);
        try {
            const storedStreak = localStorage.getItem(storageKey);
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

            if (storedStreak) {
                const parsed: StreakInfo = JSON.parse(storedStreak);
                // If the last played date is neither today nor yesterday, the streak is broken.
                if (parsed.lastPlayedDate !== today && parsed.lastPlayedDate !== yesterday) {
                    const resetStreak = { currentStreak: 0, lastPlayedDate: '' };
                    setStreakInfo(resetStreak);
                    localStorage.setItem(storageKey, JSON.stringify(resetStreak));
                } else {
                    setStreakInfo(parsed);
                }
            }
        } catch (error) {
            console.error(`Failed to parse streak info for ${gameId} from localStorage`, error);
        }
    }, [isClient, storageKey]);

    const hasPlayedToday = isClient && streakInfo.lastPlayedDate === new Date().toISOString().split('T')[0];
    
    const secureStreak = useCallback(() => {
        if (!isClient) return;

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let newStreak = 1;
        if (streakInfo.lastPlayedDate === yesterday) {
            newStreak = streakInfo.currentStreak + 1;
        } else if (streakInfo.lastPlayedDate === today) {
            newStreak = streakInfo.currentStreak; // Already played today, do not increment
            return; // Exit early as we don't need to update state or show toasts
        }

        const newStreakInfo = {
            currentStreak: newStreak,
            lastPlayedDate: today,
        };

        setStreakInfo(newStreakInfo);
        localStorage.setItem(storageKey, JSON.stringify(newStreakInfo));

        // Check for rewards
        const reward = STREAK_REWARDS.find(r => r.days === newStreak);
        if (reward) {
            toast({
                title: `❄️ ${t(reward.titleKey)}`,
                description: t(reward.descriptionKey),
            });
        }
    }, [isClient, streakInfo, toast, t, storageKey]);

    return {
        streak: isClient ? streakInfo.currentStreak : 0,
        hasPlayedToday,
        secureStreak,
    };
}
