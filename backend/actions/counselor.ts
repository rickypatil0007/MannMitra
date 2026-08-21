"use server";

import { prisma } from '@/database/prisma';

export async function getActiveAlerts() {
  const alerts = await prisma.counselorAlert.findMany({
    where: {
      isRead: false
    },
    include: {
      student: {
        select: {
          name: true,
          anonymousName: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return alerts;
}

export async function markAlertAsRead(alertId: string) {
  await prisma.counselorAlert.update({
    where: { id: alertId },
    data: { isRead: true }
  });
  return { success: true };
}
