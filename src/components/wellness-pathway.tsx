'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Link as LinkIcon, Wind, Zap, BrainCircuit, Activity } from 'lucide-react';
import { useI18n } from '@/contexts/i18n';
import { pathways, Pathway } from '@/lib/pathways';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { proactiveWellnessInsights, ProactiveWellnessInput } from '@/ai/flows/proactive-wellness-insights';
import { Skeleton } from './ui/skeleton';

const pathwayIcons = {
  'exam-stress': <Zap className="w-6 h-6 text-primary" />,
  'mindfulness-basics': <Wind className="w-6 h-6 text-primary" />,
};

// SIMULATED user data for the proactive engine
const mockUserInteractionData: ProactiveWellnessInput = {
    interactionPatterns: {
      recentLoginTimes: [
        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Day before
      ],
      resourceAccessLog: ['Guide to Healthy Eating', 'Building Resilience', 'Guide to Healthy Eating'],
      forumActivityLevel: 'low',
    },
    availablePathwayIds: pathways.map(p => p.id)
};


export function WellnessPathway() {
  const { t } = useI18n();
  const [activePathway, setActivePathway] = useState<Pathway | null>(null);
  const [progress, setProgress] = useState<boolean[]>(Array(7).fill(false));
  const [currentDay, setCurrentDay] = useState(0);
  
  // State for the proactive engine
  const [recommendedPathway, setRecommendedPathway] = useState<Pathway | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(true);

  useEffect(() => {
    // Simulate calling the AI engine on page load
    proactiveWellnessInsights(mockUserInteractionData)
      .then(result => {
        if (result.recommendedPathwayId) {
          const foundPathway = pathways.find(p => p.id === result.recommendedPathwayId);
          if (foundPathway) {
            console.log("AI Rationale:", result.insightRationale); // For demo purposes
            setRecommendedPathway(foundPathway);
          }
        }
      })
      .catch(error => {
        console.error("Proactive wellness insight engine failed:", error);
      })
      .finally(() => {
        setIsLoadingRecommendation(false);
      });
  }, []);


  const startPathway = (pathway: Pathway) => {
    setActivePathway(pathway);
    setProgress(Array(7).fill(false));
    setCurrentDay(0);
  };

  const completeTask = (dayIndex: number) => {
    if (dayIndex === currentDay) {
        const newProgress = [...progress];
        newProgress[dayIndex] = true;
        setProgress(newProgress);
        
        if(currentDay < (activePathway?.tasks.length || 7) - 1) {
            setTimeout(() => setCurrentDay(currentDay + 1), 300);
        }
    }
  };

  const resetPathway = () => {
    setActivePathway(null);
  }

  // If a pathway is actively being pursued by the user
  if (activePathway) {
    const todayTask = activePathway.tasks[currentDay];
    const isCompleted = progress[currentDay];

    return (
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl animate-fade-in-up">
                    {t(activePathway.titleKey)}
                </h2>
                <p className="max-w-2xl text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up animation-delay-200">
                    {t('pathways.progress.subtitle')}
                </p>
            </div>
             <Card className="max-w-3xl mx-auto glassmorphic-card animate-fade-in-up animation-delay-300">
                <CardHeader>
                    <div className='flex justify-between items-start'>
                        <div>
                            <CardTitle>{t('pathways.progress.title')}</CardTitle>
                            <CardDescription>{t(activePathway.descriptionKey)}</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={resetPathway}>{t('pathways.progress.reset')}</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3 text-center">{t('pathways.progress.trackerTitle')}</h3>
                        <div className="flex justify-center items-center gap-3 sm:gap-4">
                            {progress.map((isDone, index) => (
                                <div key={index} className="flex flex-col items-center gap-2">
                                     <div className={cn("h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all", 
                                        isDone ? "bg-primary border-primary" : "bg-transparent",
                                        index === currentDay ? "border-primary" : "border-muted",
                                     )}>
                                        {isDone ? <CheckCircle2 className="w-5 h-5 text-primary-foreground" /> : <Circle className="w-5 h-5 text-muted" />}
                                    </div>
                                    <span className={cn("text-xs", index <= currentDay ? 'text-foreground' : 'text-muted-foreground')}>Day {index + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Card className="bg-background/50">
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <CardTitle className="text-lg">{t('pathways.progress.todayTask')}: Day {currentDay + 1}</CardTitle>
                                {isCompleted && <Badge variant="secondary">{t('pathways.progress.completed')}</Badge>}
                            </div>
                        </CardHeader>
                        <CardContent>
                           <p className="text-muted-foreground">{t(todayTask.descriptionKey)}</p>
                        </CardContent>
                        <CardFooter className='flex-col sm:flex-row gap-2'>
                           <Button className='w-full sm:w-auto' onClick={() => completeTask(currentDay)} disabled={isCompleted}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                {t('pathways.progress.markDone')}
                           </Button>
                           <a href={todayTask.link} target="_blank" rel="noopener noreferrer" className='w-full sm:w-auto'>
                                <Button variant="outline" className='w-full'>
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    {t('pathways.progress.viewResource')}
                                </Button>
                           </a>
                        </CardFooter>
                    </Card>
                </CardContent>
             </Card>
        </div>
    )
  }

  // Loading state for the AI recommendation
  if (isLoadingRecommendation) {
    return (
        <div className="container px-4 md:px-6">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-12" />
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
        </div>
    );
  }

  // If the AI has a recommendation, show it prominently
  if (recommendedPathway) {
    return (
        <div className="container px-4 md:px-6">
             <Card className="max-w-3xl mx-auto glassmorphic-card animate-fade-in-up bg-primary/5 border-primary/20">
                <CardHeader className="items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-2">
                       <BrainCircuit className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="font-bold text-xl leading-snug pt-2">
                        {t('pathways.ai.title')}
                    </CardTitle>
                    <CardDescription className="max-w-md">
                        {t('pathways.ai.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Card className='shadow-inner'>
                        <CardHeader className='items-center text-center'>
                             {pathwayIcons[recommendedPathway.id as keyof typeof pathwayIcons]}
                             <CardTitle>{t(recommendedPathway.titleKey)}</CardTitle>
                             <CardDescription>{t(recommendedPathway.descriptionKey)}</CardDescription>
                        </CardHeader>
                         <CardFooter>
                            <Button className="w-full" onClick={() => startPathway(recommendedPathway)}>
                                {t('pathways.start')}
                            </Button>
                        </CardFooter>
                    </Card>
                </CardContent>
                <CardFooter className='justify-center'>
                    <Button variant="link" onClick={() => setRecommendedPathway(null)}>{t('pathways.ai.showAll')}</Button>
                </CardFooter>
            </Card>
        </div>
    )
  }

  // Default view: show all available pathways
  return (
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className='p-4 bg-background/50 rounded-full border mb-4'>
            <Activity className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl animate-fade-in-up">
          {t('pathways.title')}
        </h2>
        <p className="max-w-2xl text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up animation-delay-200">
          {t('pathways.description')}
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2">
        {pathways.map((pathway, index) => (
          <Card
            key={pathway.id}
            className={`transform-gpu transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl flex flex-col animate-fade-in-up glassmorphic-card animation-delay-${index + 3}00`}
          >
            <CardHeader className="items-center text-center">
              {pathwayIcons[pathway.id as keyof typeof pathwayIcons]}
              <CardTitle className="font-bold text-xl leading-snug pt-2">
                {t(pathway.titleKey)}
              </CardTitle>
              <CardDescription>{t(pathway.descriptionKey)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => startPathway(pathway)}>
                {t('pathways.start')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
