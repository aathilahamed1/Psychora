
'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BookingDialog } from '@/components/booking-dialog';
import { useI18n } from '@/contexts/i18n';
import { BackButton } from '@/components/back-button';

const counselors = [
  {
    id: '1',
    name: 'Dr. Anju Sharma',
    specialty: 'Cognitive Behavioral Therapy',
    image: PlaceHolderImages.find((img) => img.id === 'counselor1'),
    tags: ['Anxiety', 'Depression', 'CBT'],
  },
  {
    id: '2',
    name: 'Dr. Rahul Gupta',
    specialty: 'Stress & Anxiety Management',
    image: PlaceHolderImages.find((img) => img.id === 'counselor2'),
    tags: ['Stress', 'Mindfulness', 'Work-life Balance'],
  },
  {
    id: '3',
    name: 'Dr. Priya Singh',
    specialty: 'Relationships & Mindfulness',
    image: PlaceHolderImages.find((img) => img.id === 'counselor3'),
    tags: ['Relationships', 'Communication', 'Self-esteem'],
  },
];

export default function BookingPage() {
  const { t } = useI18n();
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 relative">
      <BackButton />
      <div className="space-y-2 pt-12 sm:pt-0">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('booking.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('booking.description')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {counselors.map((counselor) => (
          <Card key={counselor.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                {counselor.image && (
                  <Image
                    src={counselor.image.imageUrl}
                    alt={`Portrait of ${counselor.name}`}
                    width={80}
                    height={80}
                    className="rounded-full border"
                    data-ai-hint={counselor.image.imageHint}
                  />
                )}
                <div>
                  <CardTitle>{counselor.name}</CardTitle>
                  <CardDescription>{counselor.specialty}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2">
                {counselor.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <BookingDialog counselorName={counselor.name} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
