'use server';
/**
 * @fileOverview Implements the Warm Hand-off to Counselor feature.
 *
 * This file exports:
 * - `warmHandOffToCounselor`: Function to assess risk and potentially alert a counselor.
 * - `WarmHandOffInput`: Input type for the `warmHandOffToCounselor` function.
 * - `WarmHandOffOutput`: Output type for the `warmHandOffToCounselor` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WarmHandOffInputSchema = z.object({
  studentMessage: z
    .string()
    .describe('The latest message from the student in the support chat.'),
  chatHistory: z
    .string()
    .describe('The complete chat history between the student and the AI.'),
});
export type WarmHandOffInput = z.infer<typeof WarmHandOffInputSchema>;

const WarmHandOffOutputSchema = z.object({
  isHighRisk: z
    .boolean()
    .describe(
      'Whether the student is at high risk and requires immediate assistance.'
    ),
  counselorAlertReason: z
    .string()
    .describe(
      'The reason why the counselor is being alerted, based on the student message and chat history.'
    ),
});
export type WarmHandOffOutput = z.infer<typeof WarmHandOffOutputSchema>;

export async function warmHandOffToCounselor(
  input: WarmHandOffInput
): Promise<WarmHandOffOutput> {
  return warmHandOffFlow(input);
}

const prompt = ai.definePrompt({
  name: 'warmHandOffPrompt',
  input: {schema: WarmHandOffInputSchema},
  output: {schema: WarmHandOffOutputSchema},
  prompt: `You are an AI assistant tasked with assessing student messages and chat history to determine if a student is at high risk and requires immediate assistance from a counselor.

  Analyze the following student message and chat history.  Consider factors such as suicidal ideation, self-harm, expressions of hopelessness, and significant distress.

  Based on your analysis, determine if the student is at high risk. If so, set isHighRisk to true and provide a detailed reason in counselorAlertReason.

  If the student is not at high risk, set isHighRisk to false and provide a brief explanation in counselorAlertReason.

  Student Message: {{{studentMessage}}}
  Chat History: {{{chatHistory}}}
  `,
});

const warmHandOffFlow = ai.defineFlow(
  {
    name: 'warmHandOffFlow',
    inputSchema: WarmHandOffInputSchema,
    outputSchema: WarmHandOffOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
