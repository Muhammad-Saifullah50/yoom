import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "@/lib/prisma"
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Github],
  adapter: PrismaAdapter(db),

})
