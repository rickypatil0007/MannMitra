"use server";

import { prisma } from "@/lib/prisma";

export async function getConversationHistory(firebaseUid: string, conversationIdToLoad?: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    let conversation;
    
    if (conversationIdToLoad) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationIdToLoad },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
      // Ensure the conversation belongs to the user
      if (conversation && conversation.userId !== user.id) {
        return { success: false, error: "Unauthorized" };
      }
    }

    // Get the most recent conversation or create one if none specified
    if (!conversation) {
      conversation = await prisma.conversation.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
    }

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
export async function getUserConversations(firebaseUid: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        updatedAt: true,
      }
    });

    return { success: true, conversations };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { success: false, error: "Failed to fetch conversations" };
  }
}

export async function createNewConversation(firebaseUid: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        title: "New Chat",
      }
    });

    return { success: true, conversationId: conversation.id };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { success: false, error: "Failed to create conversation" };
  }
}
