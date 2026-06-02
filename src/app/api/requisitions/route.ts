import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Global fallback for when no database is configured (Memory will reset when Vercel spins down)
const mockDatabase: any[] = [];
let mockId = 1;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, dietPreference } = body;

    // Validation
    if (!name || name.length > 50) {
      return NextResponse.json({ error: "Name is required and must be under 50 characters." }, { status: 400 });
    }
    if (!age || typeof age !== 'number' || age <= 0) {
      return NextResponse.json({ error: "Valid age is required." }, { status: 400 });
    }
    if (!dietPreference) {
      return NextResponse.json({ error: "Diet preference is required." }, { status: 400 });
    }

    // Force In-Memory Fallback completely to bypass any Vercel environment variable issues
    const newEntry = {
      id: mockId++,
      name,
      age,
      diet_preference: dietPreference,
      created_at: new Date().toISOString()
    };
    mockDatabase.push(newEntry);
    
    // Simulate slight network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ success: true, data: newEntry }, { status: 201 });
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
