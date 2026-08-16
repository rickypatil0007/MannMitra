"use server";

import { prisma } from "@/lib/prisma";

export async function findPeerMatch(firebaseUid: string, topics: string[]) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    // Simulate backend matching algorithm delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create a Daily.co room
    let roomUrl = "";
    if (process.env.DAILY_API_KEY) {
      const response = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          properties: {
            exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
            enable_chat: true,
            start_audio_off: true,
            start_video_off: true,
          },
        }),
      });
      
      const data = await response.json();
      if (data.url) {
        roomUrl = data.url;
      }
    }

    if (!roomUrl) {
      // Fallback for missing API key or error
      roomUrl = "room-" + crypto.randomUUID();
    }

    return { 
      success: true, 
      match: {
        peerId: "anonymous-" + Math.floor(Math.random() * 10000),
        matchedTopics: topics,
        roomId: roomUrl // Pass the full Daily URL
      } 
    };
  } catch (error) {
    console.error("Error finding match:", error);
    return { success: false, error: "Failed to find match" };
  }
}
