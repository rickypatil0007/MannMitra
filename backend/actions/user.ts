"use server";

import { prisma } from "@/database/prisma";

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

export async function getUserProfile(firebaseUid: string) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    return { 
      success: true, 
      profile: {
        firstName: user.name?.split(' ')[0] || "",
        lastName: user.name?.split(' ').slice(1).join(' ') || "",
        email: user.email,
        institution: user.institution || "",
      } 
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}

export async function updateUserProfile(firebaseUid: string, data: { firstName?: string, lastName?: string, institution?: string }) {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, error: "User not found" };

    const nameParts = [];
    if (data.firstName) nameParts.push(data.firstName.trim());
    if (data.lastName) nameParts.push(data.lastName.trim());
    const fullName = nameParts.length > 0 ? nameParts.join(" ") : undefined;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(fullName ? { name: fullName } : {}),
        ...(data.institution !== undefined ? { institution: data.institution } : {}),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
