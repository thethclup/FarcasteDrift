// @ts-nocheck
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: "Farcast Drift Orchestrator",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Farcast Drift",
    version: "1.0.0"
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    }
  });
}

export async function POST(req: Request) {
    return NextResponse.json({
        status: "success",
        message: "Agent received POST request"
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      }
    });
}
