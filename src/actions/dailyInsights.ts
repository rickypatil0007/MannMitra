"use server";

import { prisma } from "@/lib/prisma";

export interface DailyInsightData {
  summary: {
    stressIndicator: number; // 1-5
    tasksCompleted: number;
    tasksRemaining: number;
    completionRate: number;
  };
  chartData: Array<{
    day: string;
    stressLevel: number;
    tasksCompleted: number;
  }>;
  stressReport: {
    currentIndicator: string;
    weeklyTrend: string;
    highestDay: string;
    lowestDay: string;
    recommendation: string;
  };
  detailedInsights?: {
    today: string;
    wellness: string;
    study: string;
    action: string;
  };
}

const DEMO_INSIGHTS: DailyInsightData = {
  summary: {
    stressIndicator: 3,
    tasksCompleted: 2,
    tasksRemaining: 3,
    completionRate: 40,
  },
  chartData: [
    { day: "Mon", stressLevel: 3, tasksCompleted: 4 },
    { day: "Tue", stressLevel: 5, tasksCompleted: 2 },
    { day: "Wed", stressLevel: 4, tasksCompleted: 3 },
    { day: "Thu", stressLevel: 6, tasksCompleted: 5 },
    { day: "Fri", stressLevel: 3, tasksCompleted: 4 },
  ],
  stressReport: {
    currentIndicator: "Moderate",
    weeklyTrend: "Improving",
    highestDay: "Thursday",
    lowestDay: "Monday & Friday",
    recommendation: "Your stress was highest around your mid-week workload. Consider lighter scheduling before your next exam."
  },
  detailedInsights: {
    today: "Today you completed 2 of your 5 planned tasks. Your study consistency remains strong, but your workload is higher than your recent average.",
    wellness: "Your recent check-ins indicate moderate stress. Taking a short break before your next focused study session may help maintain concentration.",
    study: "You have maintained a 3-day study streak and completed 75% of your planned tasks this week.",
    action: "Complete the SIH presentation draft first, then spend 15 minutes reviewing Engineering Mathematics notes before taking a short break."
  }
};

export async function getDailyInsights(firebaseUid: string, useDemo: boolean = false): Promise<{ success: boolean; data?: DailyInsightData; error?: string }> {
  try {
    if (useDemo) {
      return { success: true, data: DEMO_INSIGHTS };
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const now = new Date();
    const todayStr = now.toDateString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch Tasks
    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
    });

    const todaysTasks = tasks.filter(t => new Date(t.deadline).toDateString() === todayStr || new Date(t.createdAt).toDateString() === todayStr);
    const tasksCompleted = todaysTasks.filter(t => t.isCompleted).length;
    const tasksRemaining = todaysTasks.length - tasksCompleted;
    const completionRate = todaysTasks.length > 0 ? Math.round((tasksCompleted / todaysTasks.length) * 100) : 0;

    // Fetch Stress Records
    const stressRecords = await prisma.stressRecord.findMany({
      where: { userId: user.id, recordedAt: { gte: sevenDaysAgo } },
      orderBy: { recordedAt: 'asc' }
    });

    // Helper: Map enum to 1-5
    const getScore = (level: string) => {
      if (level === "VERY_LOW") return 1;
      if (level === "LOW") return 2;
      if (level === "MODERATE") return 3;
      if (level === "HIGH") return 4;
      if (level === "VERY_HIGH") return 5;
      return 3;
    };

    let todaysStress = 3;
    if (stressRecords.length > 0) {
      todaysStress = getScore(stressRecords[stressRecords.length - 1].stressLevel);
    }

    // Build Chart Data
    const chartMap = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      chartMap.set(d.toDateString(), {
        day: dayName,
        stressLevel: 0,
        tasksCompleted: 0,
      });
    }

    tasks.forEach(t => {
      if (t.isCompleted) {
        const dStr = new Date(t.updatedAt).toDateString();
        if (chartMap.has(dStr)) {
          chartMap.get(dStr).tasksCompleted++;
        }
      }
    });

    stressRecords.forEach(r => {
      const dStr = new Date(r.recordedAt).toDateString();
      if (chartMap.has(dStr)) {
        chartMap.get(dStr).stressLevel = Math.max(chartMap.get(dStr).stressLevel, getScore(r.stressLevel));
      }
    });

    const chartData = Array.from(chartMap.values());

    // Stress Report Logic
    let highestScore = -1;
    let lowestScore = 10;
    let highestDay = "N/A";
    let lowestDay = "N/A";

    chartData.forEach(d => {
      if (d.stressLevel > 0) {
        if (d.stressLevel > highestScore) { highestScore = d.stressLevel; highestDay = d.day; }
        if (d.stressLevel < lowestScore) { lowestScore = d.stressLevel; lowestDay = d.day; }
      }
    });

    let currentIndicator = "Low";
    if (todaysStress >= 4) currentIndicator = "High";
    else if (todaysStress === 3) currentIndicator = "Moderate";

    let weeklyTrend = "Stable";
    if (chartData.length >= 2) {
      const firstHalf = chartData.slice(0, 3).reduce((acc, curr) => acc + curr.stressLevel, 0) / 3;
      const secondHalf = chartData.slice(3).reduce((acc, curr) => acc + curr.stressLevel, 0) / 4;
      if (secondHalf > firstHalf + 0.5) weeklyTrend = "Increasing";
      if (secondHalf < firstHalf - 0.5) weeklyTrend = "Improving";
    }

    let recommendation = "You are maintaining a steady pace. Keep focusing on small, manageable tasks.";
    if (weeklyTrend === "Increasing") {
      recommendation = `Your stress trend is increasing, peaking on ${highestDay !== "N/A" ? highestDay : "recently"}. Consider lighter scheduling tomorrow.`;
    } else if (weeklyTrend === "Improving") {
      recommendation = "Your weekly stress trend is improving! The strategies you are using are working well.";
    }

    return {
      success: true,
      data: {
        summary: {
          stressIndicator: todaysStress,
          tasksCompleted,
          tasksRemaining,
          completionRate,
        },
        chartData,
        stressReport: {
          currentIndicator,
          weeklyTrend,
          highestDay: highestDay !== "N/A" ? highestDay : "None recorded",
          lowestDay: lowestDay !== "N/A" ? lowestDay : "None recorded",
          recommendation
        }
      }
    };
  } catch (error) {
    console.error("Error fetching daily insights:", error);
    return { success: false, error: "Failed to fetch daily insights" };
  }
}
