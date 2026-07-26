import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    await prisma.user.findFirst({
      select: { id: true },
    });

    const latencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "ok",
        database: "connected",
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    console.error("Database ping failed:", error);

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Database connection failed",
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  try {
    await prisma.user.findFirst({
      select: { id: true },
    });
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Database ping failed (HEAD):", error);
    return new NextResponse(null, { status: 500 });
  }
}
