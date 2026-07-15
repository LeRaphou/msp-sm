import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const result = await pool.query(`SELECT id, name FROM Patients ORDER BY name`);
  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest) {
  const { name, age, gender, address, phone_number, email , num_secu_social } = await request.json();

  if (!name || !age || !gender || !address || !phone_number || !email || !num_secu_social)  {
    return NextResponse.json(
      { error: "Tous les champs du patient sont requis." },
      { status: 400 }
    );
  }

  const result = await pool.query(
    `INSERT INTO Patients (name, age, gender, address, phone_number, email, num_secu_social)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name`,
    [name, age, gender, address, phone_number, email, num_secu_social]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}
