import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export const generateSupportChatResponse = async (userInput: string, chatHistory: string[]) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = \`You are an AI-powered support chat assistant for students. Your goal is to provide instant, personalized coping strategies.

Analyze the student's message and provide clear, simple advice.

**IMPORTANT FORMATTING RULES:**
- Present all coping strategies and advice as a bulleted or numbered list.
- Keep each point concise and easy to understand. Avoid long paragraphs.
- If the student expresses thoughts of self-harm, your primary response must be to direct them to on-campus counselors or mental health helplines, and you should set the referralSuggestion field.

Student Message: \${userInput}
Chat History: \${chatHistory.join('\\n')}

Response:\`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = await response.text();

  // Parse for referral
  const referralSuggestion = text.includes('self-harm') || text.includes('suicide') ? 'Please contact on-campus counselors or mental health helplines immediately.' : undefined;

  return {
    response: text,
    referralSuggestion,
  };
};

export const interpretWellnessScoresResponse = async (phq9Score: number, phq9Level: string, gad7Score: number, gad7Level: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = \`You are a supportive, empathetic AI assistant for a student wellness app. Your role is to interpret the results of a mental health check-in.

IMPORTANT: You are NOT a doctor. DO NOT provide a diagnosis. Your tone should be gentle, encouraging, and focus on recommending next steps.

The user has completed two questionnaires:
1. PHQ-9 for depression symptoms. Their score is \${phq9Score} out of 27, which is considered '\${phq9Level}'.
2. GAD-7 for anxiety symptoms. Their score is \${gad7Score} out of 21, which is considered '\${gad7Level}'.

Based on these scores, generate a short, easy-to-understand summary.
- Start by acknowledging their effort in completing the check-in.
- Briefly explain what each score might suggest in simple terms (e.g., "This might mean you're feeling...").
- If either score is 'Moderate' or higher, gently but clearly recommend they speak with a counselor.
- If scores are low, provide encouragement and suggest they explore the app's resources for maintaining well-being.
- Keep the summary to 2-3 short paragraphs.
- End on a positive and supportive note.\`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const summary = await response.text();

  return { summary };
};

export const proactiveWellnessInsightsResponse = async (interactionPatterns: any, availablePathwayIds: string[]) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = \`You are an expert mental wellness analyst. Your role is to act as a 'digital smoke alarm' by analyzing anonymous, non-personal user interaction patterns to spot subtle signs of potential struggle.

IMPORTANT: You are NOT seeing any personal data, chats, or post content. Your analysis is purely based on behavioral metadata. Your goal is to suggest a single, gentle, and helpful intervention.

Analyze the following interaction patterns:
- Recent Login Times: \${JSON.stringify(interactionPatterns.recentLoginTimes)}
- Resource Access Log: \${JSON.stringify(interactionPatterns.resourceAccessLog)}
- Forum Activity: \${interactionPatterns.forumActivityLevel}

Based on these patterns, identify the *single most relevant* wellness pathway from the provided list to gently feature on the user's home screen.

Available Pathway IDs: \${JSON.stringify(availablePathwayIds)}

Your response must be a single pathway ID or empty if no pattern. Provide a brief, internal-only rationale.\`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = await response.text();

  // Parse response, assume format "pathwayId\\nrationale"
  const lines = text.split('\\n');
  const recommendedPathwayId = lines[0].trim() || undefined;
  const insightRationale = lines.slice(1).join('\\n').trim();

  return {
    recommendedPathwayId,
    insightRationale,
  };
};
