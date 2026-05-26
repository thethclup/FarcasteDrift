// @ts-nocheck
import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json({
    name: "Farcast Drift Orchestrator",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Farcast Drift",
    version: "1.0.0"
  }, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  return NextResponse.json({
      status: "success",
      message: "Agent received POST request"
  }, { headers: CORS_HEADERS });
}
