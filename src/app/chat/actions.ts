'use server';

import { aiSupportChat } from '@/ai/flows/ai-support-chat';
import { warmHandOffToCounselor } from '@/ai/flows/warm-hand-off-to-counselor';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ActionResult {
  success: boolean;
  aiResponse?: string;
  isHighRisk?: boolean;
  counselorAlertReason?: string;
  error?: string;
}

export async function handleUserMessage(
  chatHistory: Message[],
  userInput: string
): Promise<ActionResult> {
  const fullHistory = [...chatHistory, { role: 'user', content: userInput }];
  const historyString = fullHistory
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  try {
    const [aiResult, handOffCheck] = await Promise.all([
      aiSupportChat({ userInput }),
      warmHandOffToCounselor({
        studentMessage: userInput,
        chatHistory: historyString,
      }),
    ]);

    return {
      success: true,
      aiResponse: aiResult.response,
      isHighRisk: handOffCheck.isHighRisk,
      counselorAlertReason: handOffCheck.counselorAlertReason,
    };
  } catch (error) {
    console.error('Error processing user message:', error);
    return {
      success: false,
      error: 'Sorry, I encountered an error. Please try again.',
    };
  }
}
