import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

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

    // Connect to Neon Database
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database connection string not configured." },
        { status: 500 }
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    // Create table if it doesn't exist (useful for first run)
    await sql`
      CREATE TABLE IF NOT EXISTS requisitions (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          age INTEGER NOT NULL,
          diet_preference VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insert data
    const result = await sql`
      INSERT INTO requisitions (name, age, diet_preference)
      VALUES (${name}, ${age}, ${dietPreference})
      RETURNING *;
    `;

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
