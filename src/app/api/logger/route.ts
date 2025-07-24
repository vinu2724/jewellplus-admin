// For App Router (app/api/logger/route.ts)
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const logDir = path.resolve(process.cwd(), "logs");
  const logFile = path.join(logDir, "requests.log");

  fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(logFile, JSON.stringify(body) + "\n", "utf8");

  return NextResponse.json({ status: "logged" });
}
