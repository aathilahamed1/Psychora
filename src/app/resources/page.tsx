
'use client';

import { Video, Headphones, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/contexts/i18n';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const resources = {
  videos: [
    { title: 'Guided Meditation for Beginners', description: 'A 10-minute video to start your meditation journey.', href: '#' },
    { title: 'Understanding Anxiety', description: 'An animated explanation of what anxiety is and how it affects you.', href: '#' },
    { title: 'Yoga for Stress Relief', description: 'Follow along with this gentle yoga flow to release tension.', href: '#' },
  ],
  audio: [
    { title: 'Deep Sleep Story', description: 'A calming story to help you drift off to sleep peacefully.', href: '#' },
    { title: 'Calming Nature Sounds', description: 'Immerse yourself in the sounds of a serene forest.', href: '#' },
    { title: '5-Minute Breathing Exercise', description: 'A quick audio guide to center yourself during a busy day.', href: '#' },
  ],
  guides: [
    { title: 'Building Resilience', description: 'A step-by-step guide to developing mental toughness.', href: '#' },
    { title: 'Your Digital Detox Plan', description: 'Learn how to unplug and improve your mental clarity.', href: '#' },
    { title: 'Guide to Healthy Eating', description: 'Discover the link between nutrition and mental well-being.', href: '#' },
  ],
};

const iconMap = {
  videos: <Video className="h-6 w-6 text-primary" />,
  audio: <Headphones className="h-6 w-6 text-primary" />,
  guides: <FileText className="h-6 w-6 text-primary" />,
};

type ResourceCategory = keyof typeof resources;

export default function ResourcesPage() {
  const { t } = useI18n();

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('resources.title')}</h1>
        <p className="text-muted-foreground">
          {t('resources.description')}
        </p>
      </div>

      <Tabs defaultValue="videos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="videos">{t('resources.tabs.videos')}</TabsTrigger>
          <TabsTrigger value="audio">{t('resources.tabs.audio')}</TabsTrigger>
          <TabsTrigger value="guides">{t('resources.tabs.guides')}</TabsTrigger>
        </TabsList>

        {(Object.keys(resources) as ResourceCategory[]).map((category, index) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources[category].map((item) => (
                <Link href={item.href} key={item.title} className="group">
                  <Card
                    className={cn(
                      'h-full transform-gpu transition-all duration-300 ease-in-out group-hover:scale-[1.03] group-hover:shadow-xl'
                    )}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">
                        {item.title}
                      </CardTitle>
                      {iconMap[category]}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
