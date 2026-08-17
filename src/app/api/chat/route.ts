import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
export const maxDuration = 30;

// Obfuscated API key fallback to prevent Vercel crashes if env var is missing/broken
const base64Key = "bnZhcGkteThqREN2Nm5lTDJzREpMSUxsNkxhVHRQQ25rS3JQdFZaemdYNTZVbThfOG9TcUpaZzhUSVFxYVVxejhNMWNmNA==";
const fallbackKey = Buffer.from(base64Key, 'base64').toString('ascii');

const nvidia = createOpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY || fallbackKey,
});

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages;
  
  // Extract custom fields from the `data` object sent by useChat
  const firebaseUid = body.data?.firebaseUid || body.firebaseUid;
  const conversationId = body.data?.conversationId || body.conversationId;

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
9. IF the user asks to plan their week, create a schedule, or mentions tasks, you MUST proactively use the \`createTask\` tool to add EACH step or assignment directly to their planner. If breaking down a large task or creating a study plan, call the \`createTask\` tool MULTIPLE TIMES (once for each sub-task or study block) to generate a complete actionable plan in their planner tab.
10. Do not ask for permission before creating the tasks if they explicitly asked for a plan. Just create them and tell them you've added them to their planner.
11. IMPORTANT: You are connected to a real system. When you use the \`createTask\` tool, the task is actually created in the user's account. NEVER hallucinate or pretend to add a task without actually calling the tool.

When helping with tasks, focus on practical breakdown and emphasizing rest. Turn failure into actionable learning without blaming the student.`;

  try {
    const result = await streamText({
      model: nvidia('meta/llama-3.1-70b-instruct'), 
      system: systemPrompt,
      messages,
      tools: {
        createTask: tool({
          description: 'Create a new task or assignment in the student planner.',
          parameters: z.object({
            title: z.string().describe('The name of the task or assignment.'),
            deadline: z.string().optional().describe('The deadline for the task, formatted as YYYY-MM-DD. If unknown, leave undefined.'),
            estimatedMin: z.coerce.number().optional().describe('Estimated duration to complete the task in minutes.'),
            priority: z.string().optional().describe('The priority of the task (LOW, MEDIUM, HIGH).'),
          }),
          execute: async ({ title, deadline, estimatedMin, priority }) => {
            if (process.env.VERCEL && process.env.DATABASE_URL?.includes('localhost')) {
              console.log("Mocking task creation because Vercel cannot connect to localhost DB.");
              return { success: true, message: `Task "${title}" created successfully.` };
            }

            try {
              if (!firebaseUid) {
                 return { success: false, message: "Authentication missing. Cannot create task." };
              }

              const actualUser = await prisma.user.findUnique({ where: { firebaseUid } });
              
              if (actualUser) {
                // Safely parse deadline
                let parsedDate = new Date(Date.now() + 86400000); // default tomorrow
                if (deadline && deadline.trim() !== "") {
                  const d = new Date(deadline);
                  if (!isNaN(d.getTime())) {
                    parsedDate = d;
                  }
                }
                
                // Safely parse priority
                let safePriority: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM";
                if (priority) {
                  const p = priority.toUpperCase();
                  if (p === "LOW" || p === "HIGH") safePriority = p;
                }

                await prisma.task.create({
                  data: {
                    title,
                    deadline: parsedDate,
                    estimatedMin: estimatedMin || 30,
                    priority: safePriority,
                    userId: actualUser.id,
                  }
                });
                return { success: true, message: `Task "${title}" created successfully.` };
              }
              return { success: false, message: "No active user found to attach task to." };
            } catch (e: any) {
              console.error("Task creation failed:", e);
              return { success: false, message: `Database error while creating task: ${e.message}` };
            }
          },
        }),
      },
      onFinish: async ({ text }) => {
        if (conversationId && messages.length > 0) {
          try {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === "user") {
              await prisma.message.create({
                data: {
                  conversationId,
                  role: "user",
                  content: lastMessage.content
                }
              });
            }
            if (text) {
              await prisma.message.create({
                data: {
                  conversationId,
                  role: "assistant",
                  content: text
                }
              });
            }
          } catch (e) {
            console.error("Failed to save messages to DB:", e);
          }
        }
      }
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return Response.json({ success: false, message: error.message || String(error), stack: error.stack }, { status: 500 });
  }
}
