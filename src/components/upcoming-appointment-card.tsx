
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

// This is a placeholder. In a real app, you'd fetch this from a user's data.
const upcomingAppointment = {
  counselorName: 'Dr. Anju Sharma',
  date: new Date(new Date().setDate(new Date().getDate() + 3)),
  time: '10:00 AM',
};

export function UpcomingAppointmentCard() {
  const { t } = useI18n();
  const { toast } = useToast();

  const handleReschedule = () => {
    toast({
      title: 'Reschedule is not available in this demo.',
      description: 'In a real app, this would open the booking calendar.',
    });
  };

  const handleJoin = () => {
    toast({
        title: 'Session link is not yet active.',
        description: 'The "Join Session" button will be enabled 10 minutes before your scheduled time.',
      });
  }

  // In a real app, we would have logic to only show this card if an appointment exists.
  // For this demo, we'll show it statically.
  const appointmentExists = true; 

  if (!appointmentExists) {
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
                <h3 className="font-semibold text-lg mb-2">{upcomingAppointment.counselorName}</h3>
                <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{upcomingAppointment.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{upcomingAppointment.time}</span>
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
