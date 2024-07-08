'use server'
import { signIn } from "./auth"

export const handleAuth = async  (provider: string) => {
    await (signIn(provider))
}