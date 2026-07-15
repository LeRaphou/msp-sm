import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const result = await pool.query(`SELECT id, name FROM Salles ORDER BY name`);
  return NextResponse.json(result.rows);
}
