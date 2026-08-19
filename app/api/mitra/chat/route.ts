import { streamText, tool } from 'ai';
import { MitraProvider, SYSTEM_PROMPT } from '@/backend/server/mitra/mitra.provider';
import { MitraService } from '@/backend/server/mitra/mitra.service';
import { CreateTaskSchema } from '@/backend/server/mitra/mitra.validation';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;
    
    // In ai/react, useChat options.body/data are merged into the top level body
    const firebaseUid = body.data?.firebaseUid || body.firebaseUid;
    const conversationId = body.data?.conversationId || body.conversationId;

    const result = await streamText({
      model: MitraProvider.model,
      system: SYSTEM_PROMPT,
      messages,
      tools: {
        createTask: tool({
          description: 'Create a new task or assignment in the student planner.',
          parameters: CreateTaskSchema,
          execute: async (args) => {
            return await MitraService.createTask(firebaseUid, args);
          },
        }),
      },
      onFinish: async ({ text }) => {
        // Save the assistant's final text message to the DB if present
        if (conversationId && messages.length > 0) {
          try {
            const lastMessage = messages[messages.length - 1];
            // Only save the user message once (when it's the actual user message, not a tool message during multi-step)
            if (lastMessage.role === "user") {
              await MitraService.saveMessage(conversationId, "user", lastMessage.content);
            }
            if (text) {
              await MitraService.saveMessage(conversationId, "assistant", text);
            }
          } catch (e) {
            console.error("[MitraAI] Failed to save messages to DB:", e);
          }
        }
      }
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("[MitraAI] Chat API Error:", error);
    return Response.json(
      { success: false, message: error.message || String(error), stack: error.stack }, 
      { status: 500 }
    );
  }
}
