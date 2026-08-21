"use server";

import { prisma } from "@/database/prisma";

export async function getRiskHistory(firebaseUid: string, limit: number = 30) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const records = await prisma.riskAssessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // We reverse so chronological order for the graph
    return { success: true, records: records.reverse() };
  } catch (error) {
    console.error("Error fetching risk history:", error);
    return { success: false, error: "Failed to fetch risk history" };
  }
}
