
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { handleUserMessage, Message } from '@/app/chat/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useI18n } from '@/contexts/i18n';
import { Logo } from './icons';

export function ChatInterface({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHighRiskAlert, setShowHighRiskAlert] = useState(false);
  const [alertReason, setAlertReason] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await handleUserMessage(messages, input);
    setIsLoading(false);

    if (result.success && result.aiResponse) {
      const aiMessage: Message = {
        role: 'assistant',
        content: result.aiResponse,
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (result.isHighRisk) {
        setAlertReason(
          result.counselorAlertReason || 'A high-risk situation was detected.'
        );
        setShowHighRiskAlert(true);
      }
    } else {
      const errorMessage: Message = {
        role: 'assistant',
        content: result.error || t('chat.error'),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-90px)] max-w-4xl mx-auto w-full">
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto p-4 space-y-6"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-end gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role !== 'user' && (
                <Avatar className="h-8 w-8 border bg-background">
                  <AvatarFallback className="bg-transparent">
                    <Logo className="w-5 h-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-[75%] rounded-2xl p-3 px-4 text-sm whitespace-pre-wrap',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-3 justify-start">
              <Avatar className="h-8 w-8 border bg-background">
                <AvatarFallback className="bg-transparent">
                  <Logo className="w-5 h-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl p-3 px-4 flex items-center space-x-2 rounded-bl-none">
                <span className="h-2 w-2 bg-foreground/40 rounded-full animate-pulse animation-delay-100"></span>
                <span className="h-2 w-2 bg-foreground/40 rounded-full animate-pulse animation-delay-200"></span>
                <span className="h-2 w-2 bg-foreground/40 rounded-full animate-pulse animation-delay-300"></span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t-0 bg-transparent sticky bottom-0">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-md p-2 rounded-full border shadow-sm"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.input.placeholder')}
              className="flex-1 resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="w-8 h-8"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
      <AlertDialog open={showHighRiskAlert} onOpenChange={setShowHighRiskAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" />
              {t('chat.alert.title')}
            </AlertDialogTitle>
            <AlertDialogDescription
              dangerouslySetInnerHTML={{ __html: t('chat.alert.description') }}
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('chat.alert.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/booking')}>
              {t('chat.alert.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
