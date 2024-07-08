import { db } from "@/lib/prisma";
import { FieldValues } from "react-hook-form";
import bcrypt from 'bcrypt'
import { NextResponse } from "next/server";
export const login = async (data: FieldValues) => {
    try {
        const { email, password } = data;

        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        });

        if (!existingUser) {
            throw new Error('User does not exist');
        };

        const isPasswordValid = await bcrypt.compare(password, existingUser.hashed_password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        };

        return NextResponse.json({ data: existingUser, message: "User logged in successfully", status: 200 })


    } catch (error) {
        throw new Error('Invalid credentials');
    }

}