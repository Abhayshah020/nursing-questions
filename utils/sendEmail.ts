export const sendOTP = async () => {
    try {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}")
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/authentication/send-otp`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email })
            }
        )

        const data = await res.json()
        if (!res.ok) throw new Error(data.message)

        return { sent: true, msg: "Verification code sent to your email." }
    } catch (err: any) {
        return { sent: false, msg: "Failed to send OTP" }
    }
}