
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HeroGraphic } from '@/components/hero-graphic';
import { useI18n } from '@/contexts/i18n';
import { WellnessPathway } from '@/components/wellness-pathway';
import { WellnessCheckinCountdownCard } from '@/components/wellness-checkin-countdown-card';
import { UpcomingAppointmentCard } from '@/components/upcoming-appointment-card';

const features = [
  {
    titleKey: 'features.ai.title',
    descriptionKey: 'features.ai.description',
    href: '/chat',
    delay: 'animation-delay-200',
  },
  {
    titleKey: 'features.booking.title',
    descriptionKey: 'features.booking.description',
    href: '/booking',
    delay: 'animation-delay-300',
  },
  {
    titleKey: 'features.resources.title',
    descriptionKey: 'features.resources.description',
    href: '/resources',
    delay: 'animation-delay-400',
  },
  {
    titleKey: 'features.peerSupport.title',
    descriptionKey: 'features.peerSupport.description',
    href: '/peer-support',
    delay: 'animation-delay-500',
  },
];

export function StudentHomePage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center overflow-hidden">
          <div className="container px-4 md:px-6 z-10 flex flex-col items-center">
            <HeroGraphic className="w-48 h-48" />
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mt-8 animate-fade-in-up"
              style={{
                textShadow: '0 2px 8px hsl(var(--foreground) / 0.1)',
              }}
            >
              {t('welcome.title')}
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-lg text-foreground/80 animate-fade-in-up animation-delay-200">
              {t('welcome.description')}
            </p>
          </div>
        </section>

        {/* Upcoming Appointment Section */}
        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <UpcomingAppointmentCard />
        </section>

        {/* Wellness Pathway Section */}
        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <WellnessPathway />
        </section>

        {/* Feature Section */}
        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl animate-fade-in-up">
                {t('features.heading')}
              </h2>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <Link
                  key={feature.titleKey}
                  href={feature.href}
                  className="group"
                >
                  <Card
                    className={`h-full transform-gpu transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl text-center flex flex-col animate-fade-in-up glassmorphic-card ${feature.delay}`}
                  >
                    <CardHeader>
                      <CardTitle className="font-bold text-lg leading-snug">
                        {t(feature.titleKey)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">
                        {t(feature.descriptionKey)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bi-Weekly Check-in Section */}
        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <WellnessCheckinCountdownCard />
        </section>
      </main>
    </div>
  );
}
