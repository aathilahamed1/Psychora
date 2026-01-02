'use client';

import { BarChart2, TrendingUp, Users, Bot } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useI18n } from '@/contexts/i18n';

export function UsageStats() {
  const { t } = useI18n();

  const stats = [
    {
      title: t('dashboard.stats.activeUsers'),
      value: '+2,350',
      change: `+5.2% ${t('dashboard.stats.thisMonth')}`,
      icon: Users,
      delay: '0s'
    },
    {
      title: t('dashboard.stats.chatSessions'),
      value: '+12,234',
      change: `+12.1% ${t('dashboard.stats.thisMonth')}`,
      icon: Bot,
      delay: '0.1s'
    },
    {
      title: t('dashboard.stats.bookingsMade'),
      value: '+573',
      change: `+8.5% ${t('dashboard.stats.thisMonth')}`,
      icon: BarChart2,
      delay: '0.2s'
    },
    {
      title: t('dashboard.stats.moodScore'),
      value: '7.8/10',
      change: `+0.3 ${t('dashboard.stats.fromLastMonth')}`,
      icon: TrendingUp,
      delay: '0.3s'
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title} className="dashboard-card" style={{animationDelay: stat.delay}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
