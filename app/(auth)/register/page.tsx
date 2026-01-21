'use client'

import { sendOTP } from '@/utils/sendEmail'
import { ArrowRight, Lock, Mail, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        if (name === "" || email === "" || password === "" || confirmPassword === "") {
            return;
        }
        if (confirmPassword !== password) {
            setError("Password and Confirm password must match!")
            return;
        }
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/authentication/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include", // 🔥 REQUIRED FOR COOKIE JWT
                    body: JSON.stringify({ name, email, password }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Registration failed")
            }
            sessionStorage.setItem("user", JSON.stringify(data.user));
            if (data.user.emailVerified) {
                router.push("/dashboard")
            } else {
                const sentMail = await sendOTP();
                if (sentMail.sent) {
                    alert(sentMail.msg)
                    router.push("/email-verification")
                } else {
                    alert(sentMail.msg)
                }
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f4f9f8] via-[#eef4f3] to-[#e6f0ee] px-4">

            {/* Background blur */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
            </div>

            {/* Register Card */}
            <div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/50 p-8 sm:p-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Create Account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Register to start your nursing exam
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-6" onSubmit={handleRegister}>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                required
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full rounded-xl border border-gray-200 bg-white/80 px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@hospital.com"
                                className="w-full rounded-xl border border-gray-200 bg-white/80 px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-gray-200 bg-white/80 px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                required
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-gray-200 bg-white/80 px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <a href="/" className="flex hover:underline items-center gap-2 text-gray-600">
                            Already have an account?
                        </a>
                        {/* <a href="#" className="text-teal-700 hover:underline">
                            Forgot password?
                        </a> */}
                    </div>
                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-white rounded-lg bg-[#007bff] text-primary-foreground font-semibold hover:bg-[#0056b3] transition disabled:opacity-60 flex items-center justify-center gap-2 group mt-6"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Register
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="pt-6 text-center">
                    <a
                        href="https://smsitsolutions.com.au/"
                        className="text-xs text-black"
                    >
                        © {new Date().getFullYear()} SMS IT Solutions. All rights reserved.
                    </a>
                </div>
            </div>
        </div>
    )
}
