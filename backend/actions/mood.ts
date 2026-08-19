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
