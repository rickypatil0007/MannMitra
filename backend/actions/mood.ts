"use server";

import { prisma } from "@/database/prisma";
import { StressLevel } from "@/generated/prisma/client";

export async function recordMood(
  firebaseUid: string,
  moodScore: number,
  stressLevel: StressLevel,
  moodLabel?: string,
  notes?: string
) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const moodRecord = await prisma.moodRecord.create({
      data: {
        moodScore,
        stressLevel,
        moodLabel,
        notes,
        userId: user.id
      }
    });

    // Mirror to StressRecord so analytics charts pick it up
    await prisma.stressRecord.create({
      data: {
        stressLevel,
        source: "manual",
        context: moodLabel || "Emoji Check-in",
        userId: user.id
      }
    });

    // Fire off risk calculation asynchronously
    // 1. Fetch the last assessment to preserve chat signals
    const lastAssessment = await prisma.riskAssessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    // 2. Default neutral chat signals if no previous assessment
    let chatSignal = {
      sentimentScore: 1.0, 
      hasCrisisKeywords: false,
      keywordFlagScore: 0,
      matchedCategories: [] as string[]
    };
    
    if (lastAssessment) {
      const signals = lastAssessment.signals as any;
      if (signals) {
        chatSignal = {
          sentimentScore: 1.0 - (signals.chatSentiment || 0), // un-invert
          hasCrisisKeywords: signals.hasCrisisKeywords || false,
          keywordFlagScore: signals.keywordFlagScore || 0,
          matchedCategories: signals.matchedCategories || []
        };
      }
    }
    
    // 3. Import and execute computeRisk (using dynamic import to avoid circular dependencies in server actions if any)
    const { computeRisk } = await import('@/backend/server/risk/riskEngine');
    // Pass false to explicitly prevent emoji check-ins from spawning a counselor alert
    computeRisk(user.id, chatSignal, false).catch(err => {
      console.error("Failed to compute risk on mood update:", err);
    });

    return { success: true, moodRecord };
  } catch (error) {
    console.error("Error recording mood:", error);
    return { success: false, error: "Failed to record mood" };
  }
}

export async function getMoodHistory(firebaseUid: string, limit: number = 7) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const records = await prisma.moodRecord.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return { success: true, records };
  } catch (error) {
    console.error("Error fetching mood history:", error);
    return { success: false, error: "Failed to fetch mood history" };
  }
}
