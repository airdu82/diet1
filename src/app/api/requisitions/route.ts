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

    // Connect to Neon Database if available, otherwise use in-memory fallback
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      await sql`
        CREATE TABLE IF NOT EXISTS requisitions (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            age INTEGER NOT NULL,
            diet_preference VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      const result = await sql`
        INSERT INTO requisitions (name, age, diet_preference)
        VALUES (${name}, ${age}, ${dietPreference})
        RETURNING *;
      `;
      return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
    } else {
      // In-Memory Fallback
      const newEntry = {
        id: mockId++,
        name,
        age,
        diet_preference: dietPreference,
        created_at: new Date().toISOString()
      };
      mockDatabase.push(newEntry);
      return NextResponse.json({ success: true, data: newEntry }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
