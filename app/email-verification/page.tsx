'use client'

import { Mail, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { sendOTP } from '@/utils/sendEmail'
import axiosClient from '@/utils/axiosClient'

export default function VerifyEmailPage() {
    const router = useRouter()

    const [user, setUser] = useState<any>({})
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const [canResendOtp, setCanResendOtp] = useState(false)
    const [countdown, setCountdown] = useState(60) // 60 seconds countdown

    // Load user from session
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}")
        setUser(user)
        startCountdown()
    }, [])

    // Countdown timer
    const startCountdown = () => {
        setCanResendOtp(false)
        setCountdown(60)
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    setCanResendOtp(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    // Verify OTP
    const verifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()

        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP")
            return
        }

        try {
            setLoading(true)
            setError("")
            setMessage("")

            const res = await axiosClient.post("/authentication/verify-otp", {
                email: user.email,
                otp
            })

            // Axios successful response
            if (res.status === 200) {
                setMessage("Email verified successfully. Redirecting...")
                router.push("/dashboard")
            }
        } catch (err: any) {
            // Axios error handling
            if (err.response?.data?.message) {
                setError(err.response.data.message)
            } else {
                setError(err.message || "OTP verification failed")
            }
        } finally {
            setLoading(false)
        }
    }


    // Resend OTP
    const handleResend = async () => {
        try {
            setSending(true)
            setError("")
            setMessage("")

            await sendOTP() // your existing utility

            setMessage("OTP has been resent.")
            startCountdown() // restart 60s countdown

        } catch (err: any) {
            setError(err.message || "Failed to resend OTP")
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4f9f8] via-[#eef4f3] to-[#e6f0ee] px-4">

            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border p-8">

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Verify Your Email
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Enter the verification code sent to
                        <br />
                        <span className="font-medium">{user.email}</span>
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

                <form onSubmit={verifyOTP} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Verification Code
                        </label>
                        <div className="relative">
                            <Mail
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                required
                                value={otp}
                                onChange={(e) =>
                                    setOtp(e.target.value.replace(/\D/g, ""))
                                }
                                placeholder="Enter 6-digit OTP"
                                className="w-full rounded-xl border border-gray-200 bg-white/80 px-10 py-3 text-gray-800 placeholder-gray-400 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-[#007bff] text-white font-semibold hover:bg-[#0056b3] transition flex justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : <>
                            Verify Email
                            <ArrowRight size={18} />
                        </>}
                    </button>
                </form>

                {/* Resend OTP */}
                <div className="mt-6 text-center">
                    <button
                        onClick={handleResend}
                        disabled={!canResendOtp || sending}
                        className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                    >
                        {sending
                            ? "Resending..."
                            : canResendOtp
                                ? "Resend verification code"
                                : `Resend in ${countdown}s`}
                    </button>
                </div>

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
