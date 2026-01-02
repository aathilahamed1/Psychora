export declare const generateSupportChatResponse: (userInput: string, chatHistory: string[]) => Promise<{
    response: string;
    referralSuggestion: string | undefined;
}>;
export declare const interpretWellnessScoresResponse: (phq9Score: number, phq9Level: string, gad7Score: number, gad7Level: string) => Promise<{
    summary: string;
}>;
export declare const proactiveWellnessInsightsResponse: (interactionPatterns: any, availablePathwayIds: string[]) => Promise<{
    recommendedPathwayId: string | undefined;
    insightRationale: string;
}>;
//# sourceMappingURL=aiService.d.ts.map