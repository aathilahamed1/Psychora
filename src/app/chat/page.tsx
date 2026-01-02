
'use client';

import { BackButton } from '@/components/back-button';
import { ChatInterface } from '@/components/chat-interface';
import { useI18n } from '@/contexts/i18n';

export default function ChatPage() {
  const { t } = useI18n();
  const initialMessages = [
    {
      role: 'system',
      content: t('chat.ai.greeting'),
    },
  ];
  return (
    <div className="relative h-full">
      <BackButton className="absolute top-4 left-4 z-10" />
      <ChatInterface initialMessages={initialMessages} />
    </div>
  );
}
