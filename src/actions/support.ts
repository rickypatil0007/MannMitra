"use server";

import { prisma } from "@/lib/prisma";

// ==========================================
// COUNSELLING
// ==========================================

export async function getMyCounsellingRequests(firebaseUid: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const requests = await prisma.counsellingRequest.findMany({
      where: { studentId: user.id },
      orderBy: { requestedAt: "desc" },
    });

    return { success: true, requests };
  } catch (error) {
    console.error("Error fetching counselling requests:", error);
    return { success: false, error: "Failed to fetch requests" };
  }
}

export async function requestCounselling(firebaseUid: string, notes?: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const request = await prisma.counsellingRequest.create({
      data: {
        studentId: user.id,
        status: "pending",
        notes: notes || null,
      },
    });

    return { success: true, request };
  } catch (error) {
    console.error("Error requesting counselling:", error);
    return { success: false, error: "Failed to submit request" };
  }
}

// ==========================================
// TRUSTED CONTACTS
// ==========================================

export async function getTrustedContacts(firebaseUid: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const contacts = await prisma.trustedContact.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    });

    return { success: true, contacts };
  } catch (error) {
    console.error("Error fetching trusted contacts:", error);
    return { success: false, error: "Failed to fetch contacts" };
  }
}

export async function addTrustedContact(
  firebaseUid: string,
  name: string,
  phone: string,
  relationship?: string
) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const contact = await prisma.trustedContact.create({
      data: {
        userId: user.id,
        name,
        phone,
        relationship: relationship || null,
      },
    });

    return { success: true, contact };
  } catch (error) {
    console.error("Error adding trusted contact:", error);
    return { success: false, error: "Failed to add contact" };
  }
}

export async function deleteTrustedContact(firebaseUid: string, contactId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const existing = await prisma.trustedContact.findFirst({
      where: { id: contactId, userId: user.id },
    });
    if (!existing) return { success: false, error: "Contact not found" };

    await prisma.trustedContact.delete({ where: { id: contactId } });

    return { success: true };
  } catch (error) {
    console.error("Error deleting trusted contact:", error);
    return { success: false, error: "Failed to delete contact" };
  }
}

// ==========================================
// SOS
// ==========================================

export async function triggerSOS(firebaseUid: string, location?: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const alert = await prisma.sOSAlert.create({
      data: {
        userId: user.id,
        status: "active",
        location: location || null,
      },
    });

    return { success: true, alert };
  } catch (error) {
    console.error("Error triggering SOS:", error);
    return { success: false, error: "Failed to trigger SOS" };
  }
}
