"use server";

import { prisma } from "@/lib/prisma";

export async function getNotes(firebaseUid: string, search?: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const whereClause: any = { userId: user.id };

    if (search && search.trim()) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const notes = await prisma.personalNote.findMany({
      where: whereClause,
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
    });

    return { success: true, notes };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { success: false, error: "Failed to fetch notes" };
  }
}

export async function createNote(
  firebaseUid: string,
  title: string,
  content: string
) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const note = await prisma.personalNote.create({
      data: {
        title: title || "Untitled",
        content,
        userId: user.id,
      },
    });
    return { success: true, note };
  } catch (error) {
    console.error("Error creating note:", error);
    return { success: false, error: "Failed to create note" };
  }
}

export async function updateNote(
  firebaseUid: string,
  noteId: string,
  title: string,
  content: string
) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    // Ownership check
    const existing = await prisma.personalNote.findFirst({
      where: { id: noteId, userId: user.id },
    });
    if (!existing) return { success: false, error: "Note not found" };

    const note = await prisma.personalNote.update({
      where: { id: noteId },
      data: {
        title: title || "Untitled",
        content,
      },
    });
    return { success: true, note };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, error: "Failed to update note" };
  }
}

export async function deleteNote(firebaseUid: string, noteId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    // Ownership check
    const existing = await prisma.personalNote.findFirst({
      where: { id: noteId, userId: user.id },
    });
    if (!existing) return { success: false, error: "Note not found" };

    await prisma.personalNote.delete({ where: { id: noteId } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, error: "Failed to delete note" };
  }
}

export async function togglePinNote(firebaseUid: string, noteId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const existing = await prisma.personalNote.findFirst({
      where: { id: noteId, userId: user.id },
    });
    if (!existing) return { success: false, error: "Note not found" };

    const note = await prisma.personalNote.update({
      where: { id: noteId },
      data: { isPinned: !existing.isPinned },
    });
    return { success: true, note };
  } catch (error) {
    console.error("Error toggling pin:", error);
    return { success: false, error: "Failed to toggle pin" };
  }
}
