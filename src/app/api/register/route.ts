import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export const runtime = 'nodejs';

export const POST = async (request: NextRequest) => {
    try {

        const body = await request.json();

        const existingUser = await db.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (existingUser) {
            throw new Error('User already exists');
        };

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser = await db.user.create({
            data: {
                name: body.username,
                email: body.email,
                hashed_password: hashedPassword
            }
        });
        return NextResponse.json({ data: newUser, message: "User created successfully", status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ data: error, message: "Error creating user", status: 400 })
    }
}