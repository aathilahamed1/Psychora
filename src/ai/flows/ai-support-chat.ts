'use server';

/**
 * @fileOverview An AI-powered support chat that provides instant, personalized coping strategies based on user input.
 *
 * - aiSupportChat - A function that handles the support chat process.
 * - AiSupportChatInput - The input type for the aiSupportChat function.
 * - AiSupportChatOutput - The return type for the aiSupportChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSupportChatInputSchema = z.object({
  userInput: z.string().describe('The user input or message.'),
});
export type AiSupportChatInput = z.infer<typeof AiSupportChatInputSchema>;

const AiSupportChatOutputSchema = z.object({
  response: z.string().describe('The AI-generated response with coping strategies.'),
  referralSuggestion: z.string().optional().describe('A suggestion for professional referral, if necessary.'),
});
export type AiSupportChatOutput = z.infer<typeof AiSupportChatOutputSchema>;

export async function aiSupportChat(input: AiSupportChatInput): Promise<AiSupportChatOutput> {
  return aiSupportChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSupportChatPrompt',
  input: {schema: AiSupportChatInputSchema},
  output: {schema: AiSupportChatOutputSchema},
  prompt: `You are an AI-powered support chat assistant designed to provide instant, personalized coping strategies to students based on their input. Analyze the student's message and provide appropriate advice. If the student expresses thoughts of self-harm, direct them to on-campus counselors or mental health helplines.

Student Message: {{{userInput}}}
\nResponse:`, // Adding \nResponse: to guide the model's output
});

const aiSupportChatFlow = ai.defineFlow(
  {
    name: 'aiSupportChatFlow',
    inputSchema: AiSupportChatInputSchema,
    outputSchema: AiSupportChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
