"use server";

import { prisma } from "@/lib/prisma";

export async function syncUser(firebaseUid: string, email?: string | null, name?: string | null) {
  try {
    const finalEmail = email || `guest_${firebaseUid}@mannmitra.local`;
    
    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: { 
        email: finalEmail,
        ...(name ? { name } : {})
      },
      create: { 
        firebaseUid, 
        email: finalEmail, 
        name: name || "Guest User", 
        role: "STUDENT" 
      },
    });
    
    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Error syncing user:", error);
    return { success: false, error: "Failed to sync user" };
  }
}
