'use client';

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
  return <ChatInterface initialMessages={initialMessages} />;
}
