import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const result = await pool.query(`
    SELECT
      r.id,
      r.start_at AS start_time,
      r.end_at AS end_time,
      r.patient_id,
      p.name AS patient_name,
      r.professional_id,
      pr.name AS professional_name,
      r.salle_id,
      s.name AS salle_name
    FROM Reservations r
    JOIN Patients p ON p.id = r.patient_id
    JOIN Professionals pr ON pr.id = r.professional_id
    JOIN Salles s ON s.id = r.salle_id
    ORDER BY r.start_at
  `);

  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    patient_id,
    professional_id,
    salle_id,
    start_time,
    end_time,
    start_at,
    end_at,
  } = body;

  const startValue = start_at ?? start_time;
  const endValue = end_at ?? end_time;

  if (!patient_id || !professional_id || !salle_id || !startValue || !endValue) {
    return NextResponse.json(
      { error: "Tous les champs sont requis" },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO Reservations
        (patient_id, professional_id, salle_id, start_at, end_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, patient_id, professional_id, salle_id, start_at AS start_time, end_at AS end_time
      `,
      [patient_id, professional_id, salle_id, startValue, endValue]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Reservation insert failed", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}