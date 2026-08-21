import { generateObject } from 'ai';
import { z } from 'zod';
import { google } from '../ai/gemini';
import { scoreText } from './dictionary';

export const ChatSignalSchema = z.object({
  sentimentScore: z.number().min(0).max(1).describe("Overall sentiment of the user in the session (0 = very distressed/negative, 1 = very positive/calm)."),
  llmFoundCrisisKeywords: z.boolean().describe("Whether the user explicitly mentioned self-harm, suicide, or severe crisis."),
  distressCategories: z.array(z.string()).describe("Categories of distress detected, e.g., 'academic', 'financial', 'relationship', etc.")
});

export async function extractSignalsFromChat(messages: { role: string, content: string }[]) {
  const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
  const userTranscript = messages.filter(m => m.role.toLowerCase() === 'user').map(m => m.content).join(' ');
  
  // 1. Deterministic Dictionary Pass
  const dictionarySignals = scoreText(userTranscript);

  // 2. LLM Semantic Pass
  let llmSignals = {
    sentimentScore: 0.5,
    llmFoundCrisisKeywords: false,
    distressCategories: [] as string[]
  };

  try {
    const result = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: ChatSignalSchema,
      prompt: `Analyze the following chat transcript between a student (USER) and a wellness AI (ASSISTANT).\n\nTranscript:\n${transcript}\n\nExtract the required signals accurately. Be highly sensitive to crisis keywords.`,
    });
    llmSignals = result.object;
  } catch (error) {
    console.error("[SignalExtraction] Failed to extract signals via LLM:", error);
  }

  // Combine
  return {
    sentimentScore: llmSignals.sentimentScore,
    hasCrisisKeywords: dictionarySignals.forceCrisis || llmSignals.llmFoundCrisisKeywords,
    keywordFlagScore: dictionarySignals.keywordFlagScore,
    matchedCategories: Array.from(new Set([...dictionarySignals.matchedCategories, ...llmSignals.distressCategories]))
  };
}
