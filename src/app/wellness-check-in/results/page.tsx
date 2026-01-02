
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart, HeartPulse, ShieldAlert, FileText } from 'lucide-react';
import { useI18n } from '@/contexts/i18n';
import { interpretWellnessScores } from '@/ai/flows/interpret-wellness-scores';
import { questionnaires } from '@/lib/questionnaires';
import { BackButton } from '@/components/back-button';

type ResultData = {
  phq9Score: number;
  gad7Score: number;
  date: string;
};

type Interpretation = {
    level: string;
    recommendation: string;
};

export default function ResultsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [results, setResults] = useState<ResultData | null>(null);
  const [phq9Interp, setPhq9Interp] = useState<Interpretation | null>(null);
  const [gad7Interp, setGad7Interp] = useState<Interpretation | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedResults = localStorage.getItem('wellnessResults');
    if (storedResults) {
      const parsedResults: ResultData = JSON.parse(storedResults);
      setResults(parsedResults);

      const findInterpretation = (score: number, type: 'phq-9' | 'gad-7') => {
        return questionnaires[type].interpretation.find(
          (interp) => score >= interp.min && score <= interp.max
        );
      };

      const phq9 = findInterpretation(parsedResults.phq9Score, 'phq-9');
      const gad7 = findInterpretation(parsedResults.gad7Score, 'gad-7');
      
      setPhq9Interp(phq9 || null);
      setGad7Interp(gad7 || null);

      interpretWellnessScores({
        phq9Score: parsedResults.phq9Score,
        phq9Level: phq9?.level || 'Unknown',
        gad7Score: parsedResults.gad7Score,
        gad7Level: gad7?.level || 'Unknown',
      }).then(res => {
        setAiSummary(res.summary);
        setLoading(false);
      }).catch(err => {
        console.error("AI interpretation failed", err);
        setAiSummary(t('wellnessCheckin.results.aiError'));
        setLoading(false);
      });
      // Do not remove from local storage to allow refresh
      // localStorage.removeItem('wellnessResults'); 
    } else {
      router.push('/home'); // No results, redirect home
    }
  }, [router, t]);

  if (!results) {
    return (
       <div className="flex-1 p-4 sm:p-8 flex items-center justify-center">
            <Skeleton className="w-full max-w-3xl h-[600px]" />
       </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-8 relative">
      <BackButton />
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center relative pt-12 sm:pt-0">
            <h1 className="text-3xl font-bold tracking-tight">{t('wellnessCheckin.results.title')}</h1>
            <p className="text-muted-foreground mt-2">{t('wellnessCheckin.results.description', {date: new Date(results.date).toLocaleDateString()})}</p>
        </div>

        <Card className="glassmorphic-card">
            <CardHeader>
                <CardTitle>{t('wellnessCheckin.results.summaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('wellnessCheckin.results.phq9Title')}</CardTitle>
                            <HeartPulse className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{results.phq9Score} / 27</div>
                            <p className="text-xs text-muted-foreground">{phq9Interp?.level}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('wellnessCheckin.results.gad7Title')}</CardTitle>
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{results.gad7Score} / 21</div>
                            <p className="text-xs text-muted-foreground">{gad7Interp?.level}</p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>

        <Card className="glassmorphic-card">
            <CardHeader>
                <CardTitle>{t('wellnessCheckin.results.aiTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">{aiSummary}</p>
                )}
            </CardContent>
        </Card>
        
        <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>{t('wellnessCheckin.results.disclaimerTitle')}</AlertTitle>
            <AlertDescription>
                {t('wellnessCheckin.results.disclaimer')}
            </AlertDescription>
        </Alert>

        <Card>
            <CardHeader>
                <CardTitle>{t('wellnessCheckin.results.nextStepsTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                <Button variant="default" size="lg" className="h-auto" onClick={() => router.push('/booking')}>
                    <div className="flex flex-col items-start p-2">
                        <span className="font-bold text-lg">{t('wellnessCheckin.results.bookButton')}</span>
                        <span className="font-normal text-sm text-primary-foreground/80">{t('wellnessCheckin.results.bookDescription')}</span>
                    </div>
                </Button>
                 <Button variant="outline" size="lg" className="h-auto" onClick={() => router.push('/resources')}>
                     <div className="flex flex-col items-start p-2">
                        <FileText className="h-6 w-6 mb-2" />
                        <span className="font-bold text-lg">{t('wellnessCheckin.results.resourcesButton')}</span>
                        <span className="font-normal text-sm text-muted-foreground">{t('wellnessCheckin.results.resourcesDescription')}</span>
                    </div>
                </Button>
            </CardContent>
            <CardFooter>
                 <Button variant="ghost" onClick={() => router.push('/home')}>{t('wellnessCheckin.results.backToHome')}</Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
