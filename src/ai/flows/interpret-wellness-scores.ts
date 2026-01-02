'use server';

/**
 * @fileOverview An AI flow to interpret wellness questionnaire scores (PHQ-9 and GAD-7).
 *
 * - interpretWellnessScores - A function that provides a supportive summary based on scores.
 * - WellnessScoresInput - The input type for the function.
 * - WellnessScoresOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WellnessScoresInputSchema = z.object({
  phq9Score: z.number().describe('The calculated score from the PHQ-9 questionnaire (0-27).'),
  phq9Level: z.string().describe('The qualitative level of the PHQ-9 score (e.g., "Mild", "Moderate").'),
  gad7Score: z.number().describe('The calculated score from the GAD-7 questionnaire (0-21).'),
  gad7Level: z.string().describe('The qualitative level of the GAD-7 score (e.g., "Mild", "Moderate").'),
});
export type WellnessScoresInput = z.infer<typeof WellnessScoresInputSchema>;

const WellnessScoresOutputSchema = z.object({
  summary: z.string().describe('A supportive, non-clinical summary and recommendation based on the scores.'),
});
export type WellnessScoresOutput = z.infer<typeof WellnessScoresOutputSchema>;

export async function interpretWellnessScores(input: WellnessScoresInput): Promise<WellnessScoresOutput> {
  return interpretWellnessScoresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretWellnessScoresPrompt',
  input: { schema: WellnessScoresInputSchema },
  output: { schema: WellnessScoresOutputSchema },
  prompt: `You are a supportive, empathetic AI assistant for a student wellness app. Your role is to interpret the results of a mental health check-in.

IMPORTANT: You are NOT a doctor. DO NOT provide a diagnosis. Your tone should be gentle, encouraging, and focus on recommending next steps.

The user has completed two questionnaires:
1. PHQ-9 for depression symptoms. Their score is {{{phq9Score}}} out of 27, which is considered '{{{phq9Level}}}'.
2. GAD-7 for anxiety symptoms. Their score is {{{gad7Score}}} out of 21, which is considered '{{{gad7Level}}}'.

Based on these scores, generate a short, easy-to-understand summary.
- Start by acknowledging their effort in completing the check-in.
- Briefly explain what each score might suggest in simple terms (e.g., "This might mean you're feeling...").
- If either score is 'Moderate' or higher, gently but clearly recommend they speak with a counselor.
- If scores are low, provide encouragement and suggest they explore the app's resources for maintaining well-being.
- Keep the summary to 2-3 short paragraphs.
- End on a positive and supportive note.`,
});

const interpretWellnessScoresFlow = ai.defineFlow(
  {
    name: 'interpretWellnessScoresFlow',
    inputSchema: WellnessScoresInputSchema,
    outputSchema: WellnessScoresOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
