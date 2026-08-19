"use server";

import { prisma } from "@/database/prisma";
import { TaskPriority } from "@/generated/prisma/client";

export async function getUserTasks(firebaseUid: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid }
    });

    if (!user) return { success: false, error: "User not found" };

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { deadline: 'asc' },
    });

    return { success: true, tasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { success: false, error: "Failed to fetch tasks" };
  }
}

export async function createTask(
  firebaseUid: string, 
  data: { title: string; description?: string; deadline: Date; priority?: TaskPriority }
) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const task = await prisma.task.create({
      data: {
        ...data,
        userId: user.id,
      }
    });
    return { success: true, task };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function toggleTaskCompletion(firebaseUid: string, taskId: string, isCompleted: boolean) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const task = await prisma.task.update({
      where: { id: taskId, userId: user.id },
      data: { isCompleted }
    });
    return { success: true, task };
  } catch (error) {
    console.error("Error toggling task:", error);
    return { success: false, error: "Failed to toggle task" };
  }
}

export async function deleteTask(firebaseUid: string, taskId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    await prisma.task.delete({
      where: { id: taskId, userId: user.id }
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}
