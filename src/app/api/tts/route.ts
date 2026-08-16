import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!process.env.NVIDIA_TTS_API_KEY) {
      return NextResponse.json({ error: "NVIDIA_TTS_API_KEY is not set" }, { status: 500 });
    }

    // Call NVIDIA NIM TTS API
    const response = await fetch("https://integrate.api.nvidia.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_TTS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/chatterbox-multilingual-tts", // Updated to the exact model provided
        input: text,
        voice: "female", // typically female/male, or specific ID depending on the exact model
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("NVIDIA TTS Error:", err);
      return NextResponse.json({ error: "TTS Generation failed" }, { status: response.status });
    }

    // Return the raw audio buffer directly so the browser can play it
    const arrayBuffer = await response.arrayBuffer();
    
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg", // Or audio/wav depending on NVIDIA response
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("API Error in TTS:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
