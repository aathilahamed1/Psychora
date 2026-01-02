'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Calendar, Clock } from 'lucide-react';
import { useI18n } from '@/contexts/i18n';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';

export function UpcomingAppointmentCard() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { user } = useAuth();
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:4000/api/appointments')
        .then(res => res.json())
        .then(data => {
          const now = new Date();
          const upcoming = data
            .filter((appointment: any) => new Date(appointment.date.seconds * 1000) > now)
            .sort((a: any, b: any) => new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000))[0];
          if (upcoming) {
            setUpcomingAppointment({
              counselorName: upcoming.counselorName,
              date: new Date(upcoming.date.seconds * 1000),
              time: upcoming.time,
            });
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const handleReschedule = () => {
    toast({
      title: t('upcoming.appointment.reschedule.toast.title'),
      description: t('upcoming.appointment.reschedule.toast.description'),
    });
  };

  const handleJoin = () => {
    toast({
        title: t('upcoming.appointment.join.toast.title'),
        description: t('upcoming.appointment.join.toast.description'),
      });
  }

  if (!upcomingAppointment) {
    return null;
  }

  return (
    <div className="container px-4 md:px-6">
      <Card className="max-w-3xl mx-auto glassmorphic-card animate-fade-in-up">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {t('upcomingAppointment.title')}
              </CardTitle>
              <CardDescription>
                {t('upcomingAppointment.description')}
              </CardDescription>
            </div>
            <Badge variant="secondary">{t('upcomingAppointment.confirmed')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 bg-background/50 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2">{(upcomingAppointment as any).counselorName}</h3>
                <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{(upcomingAppointment as any).date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{(upcomingAppointment as any).time}</span>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto" onClick={handleJoin}>
            <Video className="mr-2 h-4 w-4" />
            {t('upcomingAppointment.join')}
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleReschedule}>
            {t('upcomingAppointment.reschedule')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
