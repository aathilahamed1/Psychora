'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useI18n } from '@/contexts/i18n';
import { ProgressChart } from '@/components/progress/progress-chart';
import {
  Activity,
  CheckCircle,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BackButton } from '@/components/back-button';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';

export default function MyProgressPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [checkinHistory, setCheckinHistory] = useState<any[]>([]);
  const [completedPathways, setCompletedPathways] = useState<any[]>([]);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Fetch wellness check-ins
      fetch('http://localhost:4000/api/wellness-checkins')
        .then(res => res.json())
        .then(data => {
          const history = data.map((checkin: any) => ({
            name: new Date(checkin.date).toLocaleDateString('en-US', { month: 'short' }),
            phq9: checkin.phq9Score,
            gad7: checkin.gad7Score,
          }));
          setCheckinHistory(history);
        })
        .catch(console.error);

      // Fetch completed pathways
      fetch('http://localhost:4000/api/pathways/completed')
        .then(res => res.json())
        .then(data => {
          const pathways = data.map((pathway: any) => ({
            id: pathway.pathwayId,
            nameKey: `pathways.${pathway.pathwayId}.title`,
            completedOn: new Date(pathway.completedAt.seconds * 1000).toLocaleDateString(),
          }));
          setCompletedPathways(pathways);
        })
        .catch(console.error);

      // Fetch session history
      fetch('http://localhost:4000/api/sessions')
        .then(res => res.json())
        .then(data => {
          const sessions = data.map((session: any) => ({
            id: session.id,
            counselorName: session.counselorName,
            date: new Date(session.date.seconds * 1000).toLocaleDateString(),
            status: session.status,
          }));
          setSessionHistory(sessions);
        })
        .catch(console.error);
    }
  }, [user]);

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 relative">
      <BackButton />
      <div className="space-y-2 pt-12 sm:pt-0">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('progress.title')}
        </h1>
        <p className="text-muted-foreground">{t('progress.description')}</p>
      </div>

      {/* Wellness Score Trends */}
      <Card className="dashboard-card" style={{ animationDelay: '0s' }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary" />
            <CardTitle>{t('progress.trends.title')}</CardTitle>
          </div>
          <CardDescription>{t('progress.trends.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressChart data={checkinHistory} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Completed Pathways */}
        <Card className="dashboard-card" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <CardTitle>{t('progress.pathways.title')}</CardTitle>
            </div>
            <CardDescription>
              {t('progress.pathways.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedPathways.length === 0 ? (
                <p className="text-muted-foreground">{t('progress.pathways.none')}</p>
              ) : (
                completedPathways.map((pathway) => (
                  <div
                    key={pathway.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border bg-background/50 p-4'
                    )}
                  >
                    <div>
                      <p className="font-semibold">{t(pathway.nameKey)}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('progress.pathways.completedOn')} {pathway.completedOn}
                      </p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Session History */}
        <Card className="dashboard-card" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <CardTitle>{t('progress.sessions.title')}</CardTitle>
            </div>
            <CardDescription>
              {t('progress.sessions.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessionHistory.length === 0 ? (
              <p className="text-muted-foreground">{t('progress.sessions.none')}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('progress.sessions.counselor')}</TableHead>
                    <TableHead>{t('progress.sessions.date')}</TableHead>
                    <TableHead className="text-right">{t('progress.sessions.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionHistory.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {session.counselorName}
                      </TableCell>
                      <TableCell>{session.date}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{session.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
