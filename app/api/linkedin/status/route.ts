import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any
    
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isConnected = !!session.user?.linkedinConnected
    const linkedinId = session.user?.linkedinId

    return NextResponse.json({
      success: true,
      isConnected,
      linkedinId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error checking LinkedIn status:", error)
    return NextResponse.json({ error: "Failed to check LinkedIn status" }, { status: 500 })
  }
}
