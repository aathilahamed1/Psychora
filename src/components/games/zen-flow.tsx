
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18n';
import { cn } from '@/lib/utils';
import { useStreak } from '@/hooks/use-streak';

const GRID_SIZE = 5;
const ORB_PAIRS = [
    { color: 'hsl(var(--chart-1))', id: 'A' },
    { color: 'hsl(var(--chart-2))', id: 'B' },
    { color: 'hsl(var(--chart-3))', id: 'C' },
    { color: 'hsl(var(--chart-4))', id: 'D' },
];

// Initial puzzle layout
const initialPuzzle = [
    ['A', '', 'B', '', ''],
    ['', '', '', '', ''],
    ['', 'C', '', 'D', ''],
    ['', '', '', '', ''],
    ['A', 'B', 'C', 'D', ''],
];


type Point = { x: number; y: number };
type Path = { id: string, points: Point[], color: string };

export function ZenFlowGame({ onComplete }: { onComplete: () => void; }) {
    const { t } = useI18n();
    const { hasPlayedToday, secureStreak } = useStreak('zen-flow');
    const [paths, setPaths] = useState<Record<string, Path>>({});
    const [activePath, setActivePath] = useState<Path | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const gridRef = useRef<HTMLDivElement>(null);
    
    const wasPlayedBeforeThisSession = hasPlayedToday && !isFinished;

    const checkWinCondition = useCallback(() => {
        const totalCells = GRID_SIZE * GRID_SIZE;
        const coveredCells = new Set<string>();
        Object.values(paths).forEach(p => p.points.forEach(pt => coveredCells.add(`${pt.x},${pt.y}`)));
        
        let allOrbsConnected = true;
        for (const orb of ORB_PAIRS) {
            const path = paths[orb.id];
            if (!path) {
                allOrbsConnected = false;
                break;
            }
            const startOrb = initialPuzzle.flat().indexOf(orb.id);
            const endOrb = initialPuzzle.flat().lastIndexOf(orb.id);

            const startPoint = { x: startOrb % GRID_SIZE, y: Math.floor(startOrb / GRID_SIZE) };
            const endPoint = { x: endOrb % GRID_SIZE, y: Math.floor(endOrb / GRID_SIZE) };
            
            const pathConnectsOrbs = 
                (path.points[0].x === startPoint.x && path.points[0].y === startPoint.y && path.points[path.points.length - 1].x === endPoint.x && path.points[path.points.length - 1].y === endPoint.y) ||
                (path.points[0].x === endPoint.x && path.points[0].y === endPoint.y && path.points[path.points.length - 1].x === startPoint.x && path.points[path.points.length - 1].y === startPoint.y);


            if (!pathConnectsOrbs) {
                allOrbsConnected = false;
                break;
            }
        }

        if (coveredCells.size === totalCells && allOrbsConnected) {
            if (!wasPlayedBeforeThisSession) {
                secureStreak();
            }
            setIsFinished(true);
        }
    }, [paths, secureStreak, wasPlayedBeforeThisSession]);
    
    useEffect(() => {
        if(Object.keys(paths).length >= ORB_PAIRS.length) {
            checkWinCondition();
        }
    }, [paths, checkWinCondition]);

    const getCellFromEvent = (e: React.MouseEvent | React.TouchEvent): Point | null => {
        if (!gridRef.current) return null;
        const rect = gridRef.current.getBoundingClientRect();
        
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const col = Math.floor((x / rect.width) * GRID_SIZE);
        const row = Math.floor((y / rect.height) * GRID_SIZE);

        if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
            return { x: col, y: row };
        }
        return null;
    };

    const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
        if(isFinished) return;
        const cell = getCellFromEvent(e as React.MouseEvent);
        if (!cell) return;

        const orbId = initialPuzzle[cell.y][cell.x];
        if (orbId) {
            const orb = ORB_PAIRS.find(p => p.id === orbId);
            if(orb) {
                const newPath = {id: orbId, points: [cell], color: orb.color};
                setPaths(prev => ({...prev, [orbId]: newPath}));
                setActivePath(newPath);
            }
        }
    };
    
    const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!activePath || isFinished) return;
        e.preventDefault();

        const cell = getCellFromEvent(e as React.MouseEvent);
        if (!cell) return;

        const lastPoint = activePath.points[activePath.points.length - 1];
        if (cell.x === lastPoint.x && cell.y === lastPoint.y) return;

        const isAdjacent = Math.abs(cell.x - lastPoint.x) + Math.abs(cell.y - lastPoint.y) === 1;
        if (!isAdjacent) return;
        
        const existingPathIndex = activePath.points.findIndex(p => p.x === cell.x && p.y === cell.y);
        if (existingPathIndex !== -1) {
             // User is backtracking, shorten the path
            const newPoints = activePath.points.slice(0, existingPathIndex + 1);
            const newActivePath = { ...activePath, points: newPoints };
            setActivePath(newActivePath);
            setPaths(prev => ({...prev, [activePath.id]: newActivePath}));
            return;
        }

        const isOccupiedByAnotherPath = Object.values(paths).some(p => p.id !== activePath.id && p.points.some(pt => pt.x === cell.x && pt.y === cell.y));
        if(isOccupiedByAnotherPath) return;

        const newPoints = [...activePath.points, cell];
        const newActivePath = { ...activePath, points: newPoints };
        setActivePath(newActivePath);
        setPaths(prev => ({...prev, [activePath.id]: newActivePath}));
        
        const endOrbId = initialPuzzle[cell.y][cell.x];
        if(endOrbId && endOrbId === activePath.id && newPoints.length > 1) {
            setActivePath(null); // Path complete
        }
    };

    const handleInteractionEnd = () => {
        setActivePath(null);
    };

    const resetGame = () => {
        setPaths({});
        setIsFinished(false);
    }
    
    const isPathCell = (x: number, y: number) => {
        return Object.values(paths).find(p => p.points.some(pt => pt.x === x && pt.y === y));
    };

    if (showInstructions) {
        return (
            <Card className="w-full max-w-md text-center glassmorphic-card">
                <CardHeader>
                    <CardTitle>{t('games.zenFlow.title')}</CardTitle>
                    <CardDescription>{t('games.zenFlow.instructions')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => setShowInstructions(false)}>{t('games.zenFlow.start')}</Button>
                </CardContent>
            </Card>
        );
    }

    if (isFinished) {
         return (
             <Card className="w-full max-w-lg text-center glassmorphic-card">
                <CardHeader>
                    <CardTitle>{t(wasPlayedBeforeThisSession ? 'games.zenFlow.completion.subsequent.title' : 'games.zenFlow.completion.first.title')}</CardTitle>
                    <CardDescription>{t(wasPlayedBeforeThisSession ? 'games.zenFlow.completion.subsequent.description' : 'games.zenFlow.completion.first.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={onComplete}>{t('games.hub.back')}</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-lg glassmorphic-card">
            <CardHeader className='text-center'>
                <CardTitle>{t('zen.flow.title')}</CardTitle>
                <CardDescription>{t('zen.flow.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                 <div
                    ref={gridRef}
                    className="grid touch-none aspect-square"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                    onMouseDown={handleInteractionStart}
                    onMouseMove={handleInteractionMove}
                    onMouseUp={handleInteractionEnd}
                    onMouseLeave={handleInteractionEnd}
                    onTouchStart={handleInteractionStart}
                    onTouchMove={handleInteractionMove}
                    onTouchEnd={handleInteractionEnd}
                >
                    {initialPuzzle.flat().map((cell, index) => {
                        const x = index % GRID_SIZE;
                        const y = Math.floor(index / GRID_SIZE);
                        const orb = ORB_PAIRS.find(p => p.id === cell);

                        return (
                            <div key={index} className="relative aspect-square border border-border flex items-center justify-center bg-transparent">
                                {orb && <div className="w-1/2 h-1/2 rounded-full z-10" style={{ backgroundColor: orb.color }} />}
                            </div>
                        );
                    })}
                     <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        {Object.values(paths).map(path => (
                            <path
                                key={path.id}
                                d={path.points.map((p, i) => {
                                    const svgX = (p.x + 0.5) * (100 / GRID_SIZE);
                                    const svgY = (p.y + 0.5) * (100 / GRID_SIZE);
                                    return `${i === 0 ? 'M' : 'L'} ${svgX}% ${svgY}%`;
                                }).join(' ')}
                                stroke={path.color}
                                strokeWidth="20"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                opacity="0.8"
                            />
                        ))}
                    </svg>
                </div>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" onClick={resetGame} className="w-full">
                    {t('zen.flow.reset')}
                 </Button>
            </CardFooter>
        </Card>
    );
}

    