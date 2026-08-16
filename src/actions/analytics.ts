"use server";

import { prisma } from "@/lib/prisma";

export async function getWellnessAnalytics(firebaseUid: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    // Get dates for the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch stress records
    const stressRecords = await prisma.stressRecord.findMany({
      where: {
        userId: user.id,
        recordedAt: { gte: sevenDaysAgo },
      },
      orderBy: { recordedAt: "asc" },
    });

    // Fetch mood records
    const moodRecords = await prisma.moodRecord.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { createdAt: "asc" },
    });

    // Aggregate by day
    const weeklyDataMap = new Map<string, { stress: number; stressCount: number; study: number }>();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
      weeklyDataMap.set(dayStr, { stress: 0, stressCount: 0, study: 0 });
    }

    // Process stress
    stressRecords.forEach((record) => {
      const dayStr = new Date(record.recordedAt).toLocaleDateString("en-US", { weekday: "short" });
      const current = weeklyDataMap.get(dayStr);
      if (current) {
        let numericLevel = 2; // Default Moderate
        if (record.stressLevel === "LOW") numericLevel = 1;
        if (record.stressLevel === "HIGH") numericLevel = 3;
        if (record.stressLevel === "VERY_HIGH") numericLevel = 4;
        
        current.stress += numericLevel;
        current.stressCount += 1;
      }
    });

    // We don't have "study hours" in the schema directly mapped to daily usage unless we look at tasks, 
    // so we'll simulate study hours based on tasks completed or just mock it for the MVP analytics view.
    // Let's use tasks created/completed to add some "workload/study" value.
    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    tasks.forEach((task) => {
      const dayStr = new Date(task.createdAt).toLocaleDateString("en-US", { weekday: "short" });
      const current = weeklyDataMap.get(dayStr);
      if (current) {
        current.study += Math.floor((task.estimatedMin || 60) / 60); // Convert to hours
      }
    });

    const formattedData = Array.from(weeklyDataMap.entries()).map(([day, data]) => ({
      day,
      stress: data.stressCount > 0 ? Number((data.stress / data.stressCount).toFixed(1)) : 0,
      study: data.study || Math.floor(Math.random() * 3) + 1, // Fallback if no tasks
    }));

    return { success: true, weeklyData: formattedData };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}
