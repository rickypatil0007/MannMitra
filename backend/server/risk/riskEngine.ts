import { prisma } from '@/database/prisma';

export type RiskBand = 'LOW' | 'MODERATE' | 'HIGH' | 'CRISIS';

export interface RiskFactors {
  questionnaireSeverity: number; // 0-1
  moodTrendScore: number;        // 0-1
  plannerDisengagement: number;  // 0-1
  chatSentiment: number;         // 0-1 (inverted, 1 = max distress)
  keywordFlagScore: number;      // 0-1
  hasCrisisKeywords: boolean;
}

export const RISK_WEIGHTS = {
  w_q: 0.4,
  w_m: 0.2,
  w_p: 0.1,
  w_c: 0.15,
  w_k: 0.15
};

export function calculateRiskScore(factors: RiskFactors): { score: number, band: RiskBand } {
  if (factors.hasCrisisKeywords) {
    return { score: 95, band: 'CRISIS' };
  }

  const rawScore = 
    (RISK_WEIGHTS.w_q * factors.questionnaireSeverity) +
    (RISK_WEIGHTS.w_m * factors.moodTrendScore) +
    (RISK_WEIGHTS.w_p * factors.plannerDisengagement) +
    (RISK_WEIGHTS.w_c * factors.chatSentiment) +
    (RISK_WEIGHTS.w_k * factors.keywordFlagScore);

  const percentageScore = rawScore * 100;
  
  let band: RiskBand = 'LOW';
  if (percentageScore >= 85) band = 'CRISIS';
  else if (percentageScore >= 65) band = 'HIGH';
  else if (percentageScore >= 40) band = 'MODERATE';

  return { score: percentageScore, band };
}

// -----------------------------------------------------------------------------
// SIGNAL EXTRACTION FROM DATABASE
// -----------------------------------------------------------------------------

export async function getPlannerSignal(userId: string): Promise<number> {
  const windowDays = 14;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);

  const tasks = await prisma.task.findMany({
    where: { userId, createdAt: { gte: cutoff } }
  });

  if (tasks.length === 0) return 0.0;

  const now = new Date();
  let overdueCount = 0;
  let lateNightCount = 0;

  for (const t of tasks) {
    if (!t.isCompleted && t.deadline < now) {
      overdueCount++;
    }
    const hour = t.createdAt.getHours();
    if (hour >= 1 && hour <= 4) {
      lateNightCount++;
    }
  }

  const missedRatio = overdueCount / Math.max(tasks.length, 1);
  const lateNightRatio = lateNightCount / Math.max(tasks.length, 1);
  
  // Normalization simple approach
  const signal = Math.min(1.0, (0.6 * missedRatio) + (0.4 * lateNightRatio));
  return signal;
}

export async function getMoodSignal(userId: string): Promise<number> {
  const windowDays = 14;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);

  const entries = await prisma.moodRecord.findMany({
    where: { userId, createdAt: { gte: cutoff } },
    orderBy: { createdAt: 'asc' }
  });

  if (entries.length === 0) return 0.0;

  // Values 1-10 (assuming 1 is very bad, 10 is very good)
  // We want to detect a declining trend (negative slope)
  const scores = entries.map(e => e.moodScore);
  
  let trend = 0;
  if (scores.length > 1) {
    // Simple linear regression slope
    const n = scores.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += scores[i];
      sumXY += i * scores[i];
      sumX2 += i * i;
    }
    trend = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  // Calculate volatility (standard deviation)
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
  const volatility = Math.sqrt(variance) / 5; // normalize roughly 0-1

  const skippedRatio = 1 - Math.min(1, entries.length / windowDays);
  
  // If trend is negative (mood is dropping), we count it. If positive, it's 0.
  const negativeTrend = trend < 0 ? Math.min(1.0, Math.abs(trend) / 2) : 0;

  const signal = Math.min(1.0, (0.5 * negativeTrend) + (0.3 * volatility) + (0.2 * skippedRatio));
  return signal;
}

export async function getQuestionnaireSignal(userId: string): Promise<number> {
  const latest = await prisma.questionnaireSubmission.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  if (!latest) return 0.0;
  return latest.severity; // Normalized 0-1
}

// -----------------------------------------------------------------------------
// MASTER RISK AGGREGATOR
// -----------------------------------------------------------------------------

export async function computeRisk(
  userId: string, 
  chatSignal: { sentimentScore: number, hasCrisisKeywords: boolean, keywordFlagScore: number, matchedCategories: string[] },
  triggerAlerts: boolean = true
) {
  // 1. Fetch DB signals
  const q = await getQuestionnaireSignal(userId);
  const m = await getMoodSignal(userId);
  const p = await getPlannerSignal(userId);
  
  // 2. Aggregate
  const factors: RiskFactors = {
    questionnaireSeverity: q,
    moodTrendScore: m,
    plannerDisengagement: p,
    chatSentiment: 1.0 - chatSignal.sentimentScore, // invert so 1 = max distress
    keywordFlagScore: chatSignal.keywordFlagScore,
    hasCrisisKeywords: chatSignal.hasCrisisKeywords
  };

  const { score, band } = calculateRiskScore(factors);

  // 3. Save to DB
  const assessment = await prisma.riskAssessment.create({
    data: {
      userId,
      riskScore: score,
      riskBand: band,
      signals: {
        ...factors,
        matchedCategories: chatSignal.matchedCategories
      } as any
    }
  });

  // 4. Alerts
  if (triggerAlerts && (band === 'HIGH' || band === 'CRISIS')) {
    const { triggerCounselorAlert } = await import('../support/counselorAlerts');
    await triggerCounselorAlert(userId, assessment);
  }

  return assessment;
}
