import bcrypt from "bcrypt";
import { pool } from "@/app/lib/db";


export async function POST(req:Request){

    const {
        email,
        password,
        name
    } = await req.json();



    const passwordHash =
        await bcrypt.hash(password,12);



    await pool.query(
        `
        INSERT INTO users
        (
            email,
            name,
            password_hash
        )
        VALUES($1,$2,$3)
        `,
        [
            email,
            name,
            passwordHash
        ]
    );


    return Response.json({
        message:"Utilisateur créé"
    });

}