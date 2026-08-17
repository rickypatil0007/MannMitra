import { prisma } from "@/lib/prisma";
import { CreateTaskArgs } from "./mitra.validation";

export class MitraService {
  /**
   * Save a message to the database
   */
  static async saveMessage(conversationId: string, role: string, content: string) {
    if (!conversationId) return;
    try {
      await prisma.message.create({
        data: {
          conversationId,
          role,
          content,
        },
      });
    } catch (e) {
      console.error("[MitraAI] Failed to save message to DB:", e);
    }
  }

  /**
   * Add a task to the user's planner
   */
  static async createTask(firebaseUid: string | null, args: CreateTaskArgs) {
    console.log("[MitraAI] Creating task:", args.title);
    
    if (process.env.VERCEL && process.env.DATABASE_URL?.includes('localhost')) {
      console.log("[MitraAI] Mocking task creation (localhost DB on Vercel)");
      return { success: true, message: `Task "${args.title}" created successfully.` };
    }

    if (!firebaseUid) {
      return { success: false, message: "Authentication missing. Cannot create task." };
    }

    try {
      const actualUser = await prisma.user.findUnique({ where: { firebaseUid } });
      
      if (!actualUser) {
        return { success: false, message: "No active user found to attach task to." };
      }

      // Safely parse deadline
      let parsedDate = new Date(Date.now() + 86400000); // default tomorrow
      if (args.deadline && args.deadline.trim() !== "") {
        const d = new Date(args.deadline);
        if (!isNaN(d.getTime())) {
          parsedDate = d;
        }
      }
      
      // Safely parse priority
      let safePriority: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM";
      if (args.priority) {
        const p = args.priority.toUpperCase();
        if (p === "LOW" || p === "HIGH") safePriority = p;
      }

      await prisma.task.create({
        data: {
          title: args.title,
          deadline: parsedDate,
          estimatedMin: args.estimatedMin || 30,
          priority: safePriority,
          userId: actualUser.id,
        },
      });

      return { success: true, message: `Task "${args.title}" created successfully.` };
    } catch (e: any) {
      console.error("[MitraAI] Task creation failed:", e);
      return { success: false, message: `Database error while creating task: ${e.message}` };
    }
  }
}
