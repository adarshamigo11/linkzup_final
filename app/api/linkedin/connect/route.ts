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
    
    // Redirect to NextAuth sign-in page with LinkedIn provider
    // This will automatically use the correct redirect URI configured in NextAuth
    const signInUrl = `${process.env.NEXTAUTH_URL}/api/auth/signin/linkedin?callbackUrl=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/dashboard?success=linkedin_connected`)}`
    
    console.log("Redirecting to LinkedIn OAuth:", signInUrl)
    return NextResponse.redirect(signInUrl)
  } catch (error) {
    console.error("LinkedIn connect error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
