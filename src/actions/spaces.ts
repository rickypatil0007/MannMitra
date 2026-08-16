"use server";

import { prisma } from "@/lib/prisma";

export async function getQuietSpaces() {
  try {
    const spaces = await prisma.quietSpace.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, spaces };
  } catch (error) {
    console.error("Error fetching quiet spaces:", error);
    return { success: false, error: "Failed to fetch quiet spaces" };
  }
}

// Optional: for admins or initial seeding
export async function createQuietSpace(data: {
  name: string;
  location: string;
  description?: string;
  capacity?: number;
  noiseLevel: string;
  features: string[];
}) {
  try {
    const space = await prisma.quietSpace.create({
      data,
    });
    return { success: true, space };
  } catch (error) {
    console.error("Error creating quiet space:", error);
    return { success: false, error: "Failed to create quiet space" };
  }
}
