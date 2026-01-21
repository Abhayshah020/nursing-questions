'use client'

import { Mail, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setMessage("")

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/authentication/forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Request failed")
            }

            setMessage(
                "If this email exists, a password reset link has been sent."
            )

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4f9f8] via-[#eef4f3] to-[#e6f0ee] px-4">

            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border p-8">

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Forgot Password
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Enter your registered email to reset your password
                    </p>
                </div>

                {message && (
                    <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

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
                                className="w-full rounded-xl border border-gray-200 bg-white/80 px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-[#007bff] text-white font-semibold hover:bg-[#0056b3] transition flex justify-center gap-2"
                    >
                        {loading ? "Sending..." : <>
                            Send Reset Link
                            <ArrowRight size={18} />
                        </>}
                    </button>
                </form>
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
