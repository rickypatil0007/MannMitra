import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  });

  if (!match) {
    return NextResponse.json({ ok: false, error: "Match not found" }, { status: 404 });
  }

  // Security: only participants can view
  if (match.userAId !== user.id && match.userBId !== user.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
  }

  const messages = await prisma.companionMessage.findMany({
    where: { matchId },
    orderBy: { createdAt: "asc" }
  });

  const formattedMessages = messages.map((msg: any) => ({
    id: msg.id,
    content: msg.content,
    createdAt: msg.createdAt,
    isMe: msg.senderId === user.id
  }));

  return NextResponse.json({ ok: true, messages: formattedMessages });
}

export async function POST(req: NextRequest) {
  try {
    const { firebaseUid, matchId, content } = await req.json();

    if (!firebaseUid || !matchId || !content) {
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

    // Security: only participants can post
    if (match.userAId !== user.id && match.userBId !== user.id) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }
    
    // Only allow sending messages if the match is CONNECTED
    if (match.status !== "CONNECTED") {
       return NextResponse.json({ ok: false, error: "Match is not active" }, { status: 400 });
    }

    const message = await prisma.companionMessage.create({
      data: {
        matchId,
        senderId: user.id,
        content
      }
    });

    return NextResponse.json({ ok: true, message });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
