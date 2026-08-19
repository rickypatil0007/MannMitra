import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/database/prisma";

export async function POST(req: NextRequest) {
  try {
    const { firebaseUid, matchId } = await req.json();

    if (!firebaseUid || !matchId) {
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
    });

    if (!match) {
      return NextResponse.json({ ok: false, error: "Match not found" }, { status: 404 });
    }

    // Security: only participants can end
    if (match.userAId !== user.id && match.userBId !== user.id) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }
    
    const updated = await prisma.companionMatch.update({
      where: { id: matchId },
      data: {
        status: "ENDED",
        endedAt: new Date()
      }
    });

    return NextResponse.json({ ok: true, match: updated });
  } catch (error) {
    console.error("Match End error:", error);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
