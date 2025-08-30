import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log("LinkedIn connect API called")
    const session = await getServerSession(authOptions)
    console.log("Session:", session ? "exists" : "null")
    
    // Check if this is a sign-in or connection request
    const url = new URL(request.url)
    const isSignIn = url.searchParams.get('signin') === 'true'
    
    if (isSignIn) {
      // For sign-in, we don't need a session
      console.log("LinkedIn sign-in flow initiated")
    } else {
      // For connection, we need a valid session
      const typedSession = session as any
      if (!typedSession?.user?.email || !typedSession?.user?.id) {
        console.log("Unauthorized - missing session data")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      console.log("LinkedIn connection flow initiated for user:", typedSession.user.email)
    }
    
    console.log("LinkedIn Client ID:", process.env.LINKEDIN_CLIENT_ID ? "exists" : "missing")
    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL)
    console.log("LINKEDIN_REDIRECT_URI:", process.env.LINKEDIN_REDIRECT_URI)
    
    // Use the LINKEDIN_REDIRECT_URI environment variable directly
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/linkedin/callback`
    
    // Prepare state data
    const stateData = isSignIn 
      ? { action: 'signin' }
      : { 
          action: 'connect', 
          userId: (session as any)?.user?.id,
          email: (session as any)?.user?.email 
        }

    // Generate LinkedIn OAuth URL
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${process.env.LINKEDIN_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent('openid profile email w_member_social r_events')}&` +
      `state=${encodeURIComponent(JSON.stringify(stateData))}`

    console.log("Generated LinkedIn auth URL:", linkedinAuthUrl)
    console.log("Redirect URI being used:", redirectUri)

    return NextResponse.redirect(linkedinAuthUrl)
  } catch (error) {
    console.error("LinkedIn connect error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
