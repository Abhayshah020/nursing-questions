'use client'

import { Lock, ArrowRight } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ResetPasswordPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setMessage("")

        try {
            if (confirmPassword !== password) {
                setError("Password and Confirm password must match!")
                return;
            }
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/authentication/reset-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token,
                        newPassword: password
                    })
                }
            )

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Reset failed")
            }

            setMessage("Password reset successful. Redirecting to login...")

            setTimeout(() => {
                router.push("/")
            }, 2000)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">Invalid reset link</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4f9f8] via-[#eef4f3] to-[#e6f0ee] px-4">

            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border p-8">

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Reset Password
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Enter your new password
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
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                required
                                minLength={8}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-gray-200 bg-white/80 px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                required
                                minLength={8}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-gray-200 bg-white/80 px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-[#007bff] text-white font-semibold hover:bg-[#0056b3] transition flex justify-center gap-2"
                    >
                        {loading ? "Resetting..." : <>
                            Reset Password
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
