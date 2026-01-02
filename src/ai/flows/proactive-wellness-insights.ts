'use server';
/**
 * @fileOverview An AI engine that analyzes anonymous user behavior to identify
 * potential struggles and suggests gentle, proactive interventions.
 *
 * - proactiveWellnessInsights - Analyzes user patterns and suggests content.
 * - ProactiveWellnessInput - The input type for the function.
 * - ProactiveWellnessOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProactiveWellnessInputSchema = z.object({
  interactionPatterns: z
    .object({
      recentLoginTimes: z
        .array(z.string().datetime())
        .describe(
          'A list of ISO 8601 timestamps for recent app logins.'
        ),
      resourceAccessLog: z
        .array(z.string())
        .describe(
          'A list of titles or IDs of resource pages the user has recently visited.'
        ),
      forumActivityLevel: z
        .enum(['high', 'normal', 'low', 'inactive'])
        .describe("The user's recent forum activity compared to their baseline."),
    })
    .describe(
      "Anonymous, non-personal interaction patterns. This data does NOT include any chat content, forum post content, or personally identifiable information. It only contains metadata about app interactions."
    ),
  availablePathwayIds: z.array(z.string()).describe("A list of available wellness pathway IDs (e.g., 'exam-stress', 'mindfulness-basics').")
});
export type ProactiveWellnessInput = z.infer<
  typeof ProactiveWellnessInputSchema
>;

const ProactiveWellnessOutputSchema = z.object({
  recommendedPathwayId: z
    .string()
    .optional()
    .describe(
      'The ID of a single, most relevant wellness pathway to gently recommend to the user. If no specific pattern is detected, this should be left empty.'
    ),
  insightRationale: z
    .string()
    .describe(
      'A brief, internal-facing explanation for why this recommendation was made.'
    ),
});
export type ProactiveWellnessOutput = z.infer<
  typeof ProactiveWellnessOutputSchema
>;

export async function proactiveWellnessInsights(
  input: ProactiveWellnessInput
): Promise<ProactiveWellnessOutput> {
  return proactiveWellnessInsightsFlow(input);
}

const PromptInputSchema = z.object({
    loginTimes: z.string(),
    accessedResources: z.string(),
    forumActivityLevel: z.enum(['high', 'normal', 'low', 'inactive']),
    availablePathwayIds: z.string(),
});

const prompt = ai.definePrompt({
  name: 'proactiveWellnessInsightsPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: ProactiveWellnessOutputSchema },
  prompt: `You are an expert mental wellness analyst. Your role is to act as a 'digital smoke alarm' by analyzing anonymous, non-personal user interaction patterns to spot subtle signs of potential struggle.

IMPORTANT: You are NOT seeing any personal data, chats, or post content. Your analysis is purely based on behavioral metadata. Your goal is to suggest a single, gentle, and helpful intervention.

Analyze the following interaction patterns:
- Recent Login Times: Are they consistently late at night or at unusual hours?
- Resource Access Log: Is the user repeatedly accessing resources related to a specific topic like 'anxiety', 'panic attacks', or 'sleep'?
- Forum Activity: Has there been a sudden drop in engagement from a previously active user?

Based on these patterns, identify the *single most relevant* wellness pathway from the provided list to gently feature on the user's home screen.

- If a user suddenly starts logging in late at night, a pathway about sleep might be relevant.
- If a user is repeatedly viewing resources on anxiety and exams, the 'exam-stress' pathway is a good fit.
- If no strong, actionable pattern emerges, DO NOT recommend a pathway. It is better to do nothing than to make an irrelevant suggestion.

Your response must be a single pathway ID. Provide a brief, internal-only rationale for your choice.

Interaction Patterns:
- Login Times: {{{loginTimes}}}
- Accessed Resources: {{{accessedResources}}}
- Forum Activity: {{{forumActivityLevel}}}

Available Pathway IDs: {{{availablePathwayIds}}}
`,
});


const proactiveWellnessInsightsFlow = ai.defineFlow(
  {
    name: 'proactiveWellnessInsightsFlow',
    inputSchema: ProactiveWellnessInputSchema,
    outputSchema: ProactiveWellnessOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
        loginTimes: JSON.stringify(input.interactionPatterns.recentLoginTimes),
        accessedResources: JSON.stringify(input.interactionPatterns.resourceAccessLog),
        forumActivityLevel: input.interactionPatterns.forumActivityLevel,
        availablePathwayIds: JSON.stringify(input.availablePathwayIds),
    });
    return output!;
  }
);
