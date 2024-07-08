'use client'

import Image from "next/image"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { handleAuth } from "@/lib/handleAuth"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { useState } from "react"
import clsx from "clsx"
import { usePathname, useRouter } from "next/navigation"
import { Loader } from "../shared/Loader"
import { useToast } from "@/components/ui/use-toast"
import { login } from "@/actions/user.action"


type AuthFormProps = {
    type: 'login' | 'signup'
}

const AuthForm = ({ type }: AuthFormProps) => {

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>()
    const [loading, setLoading] = useState(false)
    const pathname = usePathname();
    const { toast } = useToast()
    const router = useRouter();


    const handleAuthFormSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            setLoading(true)

            if (pathname === '/signup') {
                const request = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })

                const response = await request.json();

                if (response.status === 200) router.push('/login')

                toast({
                    title: response.message,
                    description: response.status === 200 ? 'Now log into your account' : "Please try again using different email",
                    variant: response.status === 200 ? 'success' : 'destructive',
                })
            }

            else {
                const request = await login(data);
                console.log(request);
            }


        } catch (error) {
            console.error(error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(handleAuthFormSubmit)}>
            <div className="flex flex-col gap-8  h-fit bg-sec p-9 rounded-md py-10">
                <div className="flex flex-col gap-2">
                    <Image
                        src={'/icons/yoom-logo.svg'}
                        alt="logo"
                        width={100}
                        height={110}
                    />
                    <p className="text-white text-sm">
                        {type === 'signup'
                            ? 'Sign up to start Yooming!'
                            : 'Login to continue to Yoom'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="flex border border-ter items-center justify-center p-2 rounded-sm hover:bg-ter">
                        <Image
                            src={'/icons/google.png'}
                            alt="logo"
                            width={25}
                            height={25}
                            onClick={() => handleAuth('google')}
                        />
                    </div>
                    <div className="flex items-center border border-ter justify-center p-2 rounded-sm hover:bg-ter">
                        <Image
                            src={'/icons/github.png'}
                            alt="logo"
                            width={25}
                            height={25}
                            onClick={() => handleAuth('github')}

                        />
                    </div>
                </div>
                <div className="flex flex-col gap-4">

                    {type === 'signup' && (
                        <div>
                            <Label className="text-white">Username</Label>
                            <Input
                                type="text"
                                className="bg-ter border-sec caret-blue text-blue  focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="John Doe"
                                {...register('username', {
                                    required: true,
                                    minLength: {
                                        value: 3,
                                        message: "Username must be at least 3 characters"
                                    }
                                })}
                            />
                            {/*@ts-ignore */}
                            {errors.username && <p className="text-xs text-red-500">{errors?.username?.message}</p>}
                        </div>
                    )}
                    <div>

                        <Label className="text-white">Email Address</Label>
                        <Input
                            type="email"
                            className="bg-ter border-sec caret-blue text-blue  focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="example@abc.com"
                            {...register('email', { required: "Email is required" })}
                        />
                        {/*@ts-ignore */}
                        {errors.email && <p className="text-xs text-red-500">{errors?.email?.message}</p>}
                    </div>
                    {type === 'signup' && (
                        <div>
                            <Label className="text-white">Password</Label>
                            <Input
                                type="password"
                                className="bg-ter border-sec caret-blue text-blue  focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="abc123"
                                {...register('password',
                                    {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }, maxLength: {
                                            value: 20,
                                            message: "Password must be less than 20 characters"
                                        }
                                    })}
                            />
                            {/*@ts-ignore */}
                            {errors.password && <p className="text-xs text-red-500">{errors?.password?.message}</p>}
                        </div>
                    )}
                    <Button
                        className={clsx("bg-blue hover:bg-blue hover:opacity-90", {
                            loading: "opacity-60"
                        })}
                    >
                        {loading ? <Loader /> : 'Continue'}
                    </Button>
                </div>
                <div className="flex justify-between gap-2 text-sm">
                    <p className="text-white">
                        {type === 'signup' ? 'Already' : 'Dont'} have an account?
                    </p>
                    <Link href={type === 'signup' ? '/login' : '/signup'} className="text-blue underline underline-offset-2">
                        {type === 'signup' ? 'Login' : 'Sign up'}
                    </Link>
                </div>

            </div>
        </form>
    )
}

export default AuthForm
