
'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/i18n';

export function BackButton({ className, href }: { className?: string, href?: string }) {
  const router = useRouter();
  const { t } = useI18n();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={cn('absolute top-4 left-4 flex items-center gap-2 z-10', className)}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{t('back.button')}</span>
    </Button>
  );
}

    