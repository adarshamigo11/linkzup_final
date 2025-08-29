import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const config = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID ? "✅ Set" : "❌ Missing",
      LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET ? "✅ Set" : "❌ Missing",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
      MONGODB_URI: process.env.MONGODB_URI ? "✅ Set" : "❌ Missing",
      redirectUri: process.env.NEXTAUTH_URL + '/api/linkedin/callback',
      nextAuthRedirectUri: process.env.NEXTAUTH_URL + '/api/auth/callback/linkedin',
    }

    return NextResponse.json({
      success: true,
      config,
      message: "LinkedIn configuration check completed"
    })
  } catch (error) {
    console.error("Error checking LinkedIn config:", error)
    return NextResponse.json({ 
      error: "Failed to check configuration",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
