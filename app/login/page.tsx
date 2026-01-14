'use client'

import { ArrowRight, Lock, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/authentication/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include", // 🔥 REQUIRED FOR COOKIES
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // ✅ Store user only (UI use)
            sessionStorage.setItem("user", JSON.stringify(data.user));

            router.push("/recruitment-forms")

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f4f9f8] via-[#eef4f3] to-[#e6f0ee] px-4">

            {/* Background decorative blur */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/50 p-8 sm:p-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Secure access to your nursing dashboard
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleLogin}>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@hospital.com"
                                className="w-full rounded-xl border border-gray-200 bg-white/80 px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
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
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-gray-200 bg-white/80 px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    {/* Options */}
                    {/* <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            Remember me
                        </label>
                        <a href="#" className="text-teal-700 hover:underline">
                            Forgot password?
                        </a>
                    </div> */}

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-[#007bff] text-primary-foreground cursor-pointer font-semibold hover:bg-[#0056b3] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-6"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign in
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="pt-6">
                    <a href="https://smsitsolutions.com.au/" className="text-xs text-muted-foreground text-center">
                        © {new Date().getFullYear()} SMS IT Solutions. All rights reserved.
                    </a>
                </div>
            </div>
        </div>
    )
}
