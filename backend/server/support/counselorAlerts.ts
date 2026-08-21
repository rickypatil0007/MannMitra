import { prisma } from '@/database/prisma';

export async function triggerCounselorAlert(studentId: string, assessment: any) {
  // Check if an active, unread alert already exists for this student to prevent spam
  const existingAlert = await prisma.counselorAlert.findFirst({
    where: {
      studentId,
      isRead: false
    }
  });

  if (existingAlert) {
    console.log(`[CounselorAlert] Alert already active for student ${studentId}. Skipping duplicate.`);
    return;
  }

  const alertType = assessment.riskBand === 'CRISIS' ? 'CRISIS_KEYWORD' : 'HIGH_RISK_DETECTED';
  const description = `Student's risk assessment reached ${assessment.riskBand} band (Score: ${assessment.riskScore.toFixed(1)}/100). Please review their profile and intervene if necessary.`;

  await prisma.counselorAlert.create({
    data: {
      studentId,
      alertType,
      description
    }
  });

  console.log(`[CounselorAlert] Triggered ${alertType} for student ${studentId}.`);
}
