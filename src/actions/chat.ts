"use server";

import { prisma } from "@/lib/prisma";

export async function getConversationHistory(firebaseUid: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    // Get the most recent conversation or create one
    let conversation = await prisma.conversation.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          title: "New Chat",
        },
        include: { messages: true }
      });
    }

    return { success: true, conversationId: conversation.id, messages: conversation.messages };
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return { success: false, error: "Failed to fetch history" };
  }
}
