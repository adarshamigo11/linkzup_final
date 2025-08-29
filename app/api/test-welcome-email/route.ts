import { NextRequest, NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/email-utils"

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ 
        error: "Name and email are required" 
      }, { status: 400 })
    }

    // Send welcome email
    const result = await sendWelcomeEmail({
      name,
      email,
    })

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Welcome email sent successfully" 
      })
    } else {
      return NextResponse.json({ 
        error: "Failed to send welcome email",
        details: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Test welcome email error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
