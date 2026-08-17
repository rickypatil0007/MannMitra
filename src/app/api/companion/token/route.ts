import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { firebaseUid, matchId } = await req.json();

    if (!firebaseUid || !matchId) {
      return NextResponse.json({ ok: false, error: "Missing parameters" }, { status: 400 });
    }

    // Authenticate and fetch user
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    // Verify user is part of the match and it is connected
    const match = await prisma.companionMatch.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ ok: false, error: "Match not found" }, { status: 404 });
    }

    if (match.userAId !== user.id && match.userBId !== user.id) {
      return NextResponse.json({ ok: false, error: "Unauthorized to join this room" }, { status: 403 });
    }

    if (match.status !== "CONNECTED") {
      return NextResponse.json({ ok: false, error: "Match is not connected" }, { status: 400 });
    }

    // Generate LiveKit token
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      return NextResponse.json({ ok: false, error: "LiveKit not configured" }, { status: 500 });
    }

    // The room name is simply the match ID to keep participants in the same call
    const roomName = match.id;
    // Participant identity is the user's DB ID
    const participantIdentity = user.id;
    
    // We can show anonymous names
    const participantName = user.anonymousName || "Anonymous Peer";

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantName,
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    const url = process.env.LIVEKIT_URL;
    if (!url) {
      return NextResponse.json({ ok: false, error: "LiveKit URL not configured" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, token, url });
  } catch (error) {
    console.error("Token error:", error);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
