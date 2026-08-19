import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/database/prisma";

export async function POST(req: NextRequest) {
  try {
    const { firebaseUid, topic } = await req.json();

    if (!firebaseUid || !topic) {
      return NextResponse.json({ ok: false, error: "Missing parameters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    // 1. Check if user already has an active MATCH (SEARCHING or CONNECTED)
    const existingMatch = await prisma.companionMatch.findFirst({
      where: {
        OR: [{ userAId: user.id }, { userBId: user.id }],
        status: { in: ["SEARCHING", "CONNECTED"] },
      },
    });

    if (existingMatch) {
      return NextResponse.json({ ok: true, match: existingMatch });
    }

    // 2. Look for someone else searching for the same topic
    const availableMatch = await prisma.companionMatch.findFirst({
      where: {
        status: "SEARCHING",
        topic,
        userAId: { not: user.id }
      },
      orderBy: { createdAt: "asc" }
    });

    if (availableMatch) {
      // Connect them!
      const updatedMatch = await prisma.companionMatch.update({
        where: { id: availableMatch.id },
        data: {
          userBId: user.id,
          status: "CONNECTED",
          connectedAt: new Date()
        }
      });
      return NextResponse.json({ ok: true, match: updatedMatch });
    }

    // 3. Create a new searching match
    const newMatch = await prisma.companionMatch.create({
      data: {
        userAId: user.id,
        topic,
        status: "SEARCHING"
      }
    });

    return NextResponse.json({ ok: true, match: newMatch });
  } catch (error) {
    console.error("Match error:", error);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const matchId = req.nextUrl.searchParams.get("matchId");
  const firebaseUid = req.nextUrl.searchParams.get("firebaseUid");

  if (!matchId || !firebaseUid) {
    return NextResponse.json({ ok: false, error: "Missing parameters" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
  }

  const match = await prisma.companionMatch.findUnique({
    where: { id: matchId },
    include: {
      userA: { select: { id: true, anonymousName: true } },
      userB: { select: { id: true, anonymousName: true } }
    }
  });

  if (!match) {
    return NextResponse.json({ ok: false, error: "Match not found" }, { status: 404 });
  }

  // Security: only participants can view
  if (match.userAId !== user.id && match.userBId !== user.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json({ ok: true, match });
}
