"use server";

import { prisma } from "@/lib/prisma";

export async function findPeerMatch(firebaseUid: string, topics: string[]) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    // Simulate backend matching algorithm delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, this would query active users with overlapping tags
    // For MVP, we simulate a successful match
    return { 
      success: true, 
      match: {
        peerId: "anonymous-" + Math.floor(Math.random() * 10000),
        matchedTopics: topics,
        roomId: "room-" + crypto.randomUUID()
      } 
    };
  } catch (error) {
    console.error("Error finding match:", error);
    return { success: false, error: "Failed to find match" };
  }
}
