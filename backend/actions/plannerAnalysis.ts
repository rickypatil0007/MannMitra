"use server";

import { prisma } from "@/database/prisma";

export interface HeatmapDay {
  date: string;
  count: number;
}

export interface PlannerAnalysisResult {
  heatmap: HeatmapDay[];
  totalCompleted: number;
  currentStreak: number;
  examAnalysis: {
    hasUpcomingExam: boolean;
    examTitle: string;
    daysRemaining: number;
    remainingTasks: number;
    aiRecommendation: string;
  } | null;
}

const DEMO_ANALYSIS: PlannerAnalysisResult = {
  heatmap: [
    // We will dynamically generate the last ~60 days, but manually inject the specific demo dates required by prompt.
  ],
  totalCompleted: 45,
  currentStreak: 4,
  examAnalysis: {
    hasUpcomingExam: true,
    examTitle: "Mathematics Exam",
    daysRemaining: 7,
    remainingTasks: 18,
    aiRecommendation: "You have 18 planned tasks across the next 7 days. Consider reducing today's workload and prioritizing the highest-impact topics. Moving lower-priority tasks to after the exam may help."
  }
};

export async function getPlannerAnalysis(firebaseUid: string, useDemo: boolean = false): Promise<{ success: boolean; data?: PlannerAnalysisResult; error?: string }> {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Generate base heatmap array for last 60 days
    const heatmapMap = new Map<string, number>();
    for (let i = 59; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      heatmapMap.set(d.toISOString().split('T')[0], 0);
    }

    if (useDemo) {
      // Inject demo data
      // Find the dates corresponding to "Aug 10", "Aug 11", etc relative to current month/year or just use exact dates if we want.
      // The prompt says "Aug 10 -> 2 tasks" etc. We will construct them for August of the current year.
      const currentYear = now.getFullYear();
      heatmapMap.set(`${currentYear}-08-10`, 2);
      heatmapMap.set(`${currentYear}-08-11`, 3);
      heatmapMap.set(`${currentYear}-08-12`, 0);
      heatmapMap.set(`${currentYear}-08-13`, 4);
      heatmapMap.set(`${currentYear}-08-14`, 2);
      heatmapMap.set(`${currentYear}-08-15`, 5);
      heatmapMap.set(`${currentYear}-08-16`, 3);
      // Ensure today has something or nothing based on demo
      
      const demoData = { ...DEMO_ANALYSIS };
      demoData.heatmap = Array.from(heatmapMap.entries()).map(([date, count]) => ({ date, count }));
      return { success: true, data: demoData };
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { deadline: 'asc' }
    });

    let totalCompleted = 0;
    tasks.forEach(t => {
      if (t.isCompleted) {
        totalCompleted++;
        const updatedDateStr = new Date(t.updatedAt).toISOString().split('T')[0];
        if (heatmapMap.has(updatedDateStr)) {
          heatmapMap.set(updatedDateStr, heatmapMap.get(updatedDateStr)! + 1);
        }
      }
    });

    // Calculate Streak
    let currentStreak = 0;
    for (let i = 0; i < 60; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dStr = d.toISOString().split('T')[0];
      const count = heatmapMap.get(dStr) || 0;
      if (count > 0) {
        currentStreak++;
      } else {
        if (i > 0) break; // Break if not today
      }
    }

    // Exam Analysis
    let examAnalysis = null;
    const upcomingTasks = tasks.filter(t => !t.isCompleted && new Date(t.deadline) > now);
    
    // Find exam: either title contains "Exam" or "Test", or Priority is CRITICAL
    const upcomingExam = upcomingTasks.find(t => 
      t.title.toLowerCase().includes("exam") || 
      t.title.toLowerCase().includes("test") || 
      t.priority === "CRITICAL"
    );

    if (upcomingExam) {
      const examDate = new Date(upcomingExam.deadline);
      const timeDiff = examDate.getTime() - now.getTime();
      const daysRemaining = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
      
      // Calculate tasks due before or on the exam day
      const remainingTasks = upcomingTasks.filter(t => new Date(t.deadline) <= examDate).length;

      let aiRecommendation = "";
      if (daysRemaining <= 7 && remainingTasks > 10) {
        aiRecommendation = `You have ${remainingTasks} planned tasks across the next ${daysRemaining} days. Consider reducing today's workload and prioritizing the highest-impact topics. Move lower-priority tasks to after the exam.`;
      } else if (remainingTasks > 5) {
        aiRecommendation = `Your exam is approaching in ${daysRemaining} days. Today's workload is high. Try splitting the workload into morning, afternoon, and evening sessions.`;
      } else {
        aiRecommendation = `You have ${daysRemaining} days until your exam with ${remainingTasks} tasks remaining. You're on track. Maintain a steady pace and don't forget to take breaks.`;
      }

      examAnalysis = {
        hasUpcomingExam: true,
        examTitle: upcomingExam.title,
        daysRemaining,
        remainingTasks,
        aiRecommendation
      };
    }

    return {
      success: true,
      data: {
        heatmap: Array.from(heatmapMap.entries()).map(([date, count]) => ({ date, count })),
        totalCompleted,
        currentStreak,
        examAnalysis
      }
    };

  } catch (error) {
    console.error("Error fetching planner analysis:", error);
    return { success: false, error: "Failed to fetch planner analysis" };
  }
}
