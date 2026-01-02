
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MoodChart } from '@/components/dashboard/mood-chart';
import { StressorsChart } from '@/components/dashboard/stressors-chart';
import { UsageStats } from '@/components/dashboard/usage-stats';
import { useI18n } from '@/contexts/i18n';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/dashboard/user-management';

export default function DashboardPage() {
  const { t } = useI18n();
  const { user, loading } = useAuth();
  const router = useRouter();

  const hasAccess = !loading && user && (user.role === 'Admin' || user.role === 'Super Admin');

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'Admin' && user.role !== 'Super Admin'))) {
      router.push('/home');
    }
  }, [user, loading, router]);

  if (loading || !hasAccess) {
    return (
      <div className="flex-1 space-y-6 p-6 sm:p-10">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-full max-w-lg" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <Skeleton className="col-span-12 h-96 lg:col-span-7" />
          <Skeleton className="col-span-12 h-96 lg:col-span-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-10">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('dashboard.title')}
        </h1>
      </div>
      <p className="text-muted-foreground">{t('dashboard.description')}</p>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t('dashboard.tabs.overview')}</TabsTrigger>
          {user?.role === 'Super Admin' && (
            <TabsTrigger value="users">{t('dashboard.tabs.userManagement')}</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <UsageStats />
          </div>
          <div className="grid grid-cols-12 gap-6">
            <Card
              className="dashboard-card col-span-12 lg:col-span-7"
              style={{ animationDelay: '0.2s' }}
            >
              <CardHeader>
                <CardTitle>{t('dashboard.moodTrends.title')}</CardTitle>
              </CardHeader>
              <CardContent className="pl-4">
                <MoodChart />
              </CardContent>
            </Card>
            <Card
              className="dashboard-card col-span-12 lg:col-span-5"
              style={{ animationDelay: '0.3s' }}
            >
              <CardHeader>
                <CardTitle>{t('dashboard.stressors.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <StressorsChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {user?.role === 'Super Admin' && (
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
