import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
export const maxDuration = 30;

// NVIDIA NIM uses the OpenAI SDK format with a custom baseURL
const nvidia = createOpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `You are Mitra, an AI-powered student wellness companion for 'MannMitra'. 
Your primary goal is to help students understand, manage, and reduce academic and personal stress.

CORE DIRECTIVES:
1. You are an AI companion, not a medical professional, therapist, or human counsellor. 
2. NEVER diagnose mental health disorders (e.g., do not say "You have depression"). 
3. Frame outputs as observations, possible patterns, wellness suggestions, and planning recommendations.
4. Listen, understand context, identify patterns, and help organize thoughts.
5. If a student mentions severe distress, self-harm, or feeling overwhelmed, gently encourage them to use the 'SOS' feature or talk to a trusted human contact/counsellor.
6. Provide practical advice for academic stress (e.g., breaking down assignments, scheduling breaks).
7. Communicate in a warm, non-judgmental, calm, and supportive tone.
8. You understand and can respond in regional Indian languages (like Hindi, Hinglish, Marathi) if the user initiates.
9. IF the user mentions an assignment, exam, or deadline, you MUST use the \`createTask\` tool to add it to their planner. Always prioritize breaking large tasks into smaller, manageable chunks if possible.

When helping with tasks, focus on practical breakdown and emphasizing rest. Turn failure into actionable learning without blaming the student.`;

  try {
    const result = await streamText({
      model: nvidia('meta/llama-3.1-70b-instruct'), 
      system: systemPrompt,
      messages,
      // tools: {
      //   createTask: tool({
      //     description: 'Create a new task or assignment in the student planner.',
      //     parameters: z.object({
      //       title: z.string().describe('The name of the task or assignment.'),
      //       deadline: z.string().optional().describe('The deadline for the task, formatted as YYYY-MM-DD. If unknown, leave undefined.'),
      //       estimatedMin: z.number().optional().describe('Estimated duration to complete the task in minutes.'),
      //       priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().describe('The priority of the task.'),
      //     }),
      //     execute: async ({ title, deadline, estimatedMin, priority }) => {
      //       return { success: true, message: `Task "${title}" created successfully (mocked).` };
      //     },
      //   }),
      // },
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return Response.json({ success: false, message: error.message || String(error), stack: error.stack }, { status: 500 });
  }
}
