import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { Pool } from "pg";
import  PoolAdapter  from "@auth/pg-adapter";

import bcrypt from "bcrypt";


const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});




export const {
    handlers,
    auth,
    signIn,
    signOut
} = NextAuth({

    adapter: PoolAdapter(pool),


    providers: [

        Credentials({
  credentials: {
    email: {
      label: "Email",
      type: "email",
    },
    password: {
      label: "Mot de passe",
      type: "password",
    },
  },
  


            async authorize(credentials){


                if(
                    !credentials?.email ||
                    !credentials?.password
                ){
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;


                const result = await pool.query(
                    `
                    SELECT *
                    FROM users
                    WHERE email=$1
                    `,
                    [
                        credentials.email
                    ]
                );


                const user = result.rows[0];


                if(!user){
                    return null;
                }



                const passwordValid = await bcrypt.compare(
                    password,
                    user.password_hash
                );


                if(!passwordValid){
                    return null;
                }



                return {

                    id: user.id.toString(),

                    name: user.name,

                    email: user.email

                };

            }

        })

    ],



    session: {

        strategy: "jwt"

    },


    pages: {

        signIn: "/login"

    }

});