import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "@/hooks/use-toast"
import { useLinkedInStatus } from "./use-linkedin-status"

interface PostData {
  content: string
  images?: string[]
  scheduledFor?: Date
}

export function useLinkedInPosting() {
  const { data: session, update } = useSession()
  const { isConnected: isLinkedInConnected } = useLinkedInStatus()
  const [isPosting, setIsPosting] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)

  // Type assertion to ensure session has the extended user properties
  const typedSession = session as any

  const postToLinkedIn = async (postData: PostData) => {
    // Check LinkedIn connection status using the status hook
    if (!isLinkedInConnected) {
      toast({
        title: "LinkedIn Not Connected",
        description: "Please connect your LinkedIn account first. Click on 'LinkedIn Not Connected' in the header to connect.",
        variant: "destructive",
      })
      return { success: false }
    }

    // Check if session exists
    if (!typedSession?.user?.id || !typedSession?.user?.email) {
      toast({
        title: "Session Error",
        description: "Please sign in again to continue.",
        variant: "destructive",
      })
      return { success: false }
    }

    setIsPosting(true)
    try {
      const response = await fetch("/api/linkedin/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postData.content,
          images: postData.images || [],
          userId: typedSession.user.id,
          userEmail: typedSession.user.email,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Posted!",
          description: "Your post has been published to LinkedIn",
        })
        // Force session update to refresh LinkedIn connection status
        await update()
        // Refresh credits display
        if (typeof window !== 'undefined' && (window as any).refreshCredits) {
          (window as any).refreshCredits()
        }
        return { success: true }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to post to LinkedIn",
          variant: "destructive",
        })
        return { success: false, error: result.message }
      }
    } catch (error) {
      console.error("Error posting to LinkedIn:", error)
      toast({
        title: "Error",
        description: "Failed to post to LinkedIn. Please try again.",
        variant: "destructive",
      })
      return { success: false, error: "Network error" }
    } finally {
      setIsPosting(false)
    }
  }

  const scheduleLinkedInPost = async (postData: PostData) => {
    // Check LinkedIn connection status using the status hook
    if (!isLinkedInConnected) {
      toast({
        title: "LinkedIn Not Connected",
        description: "Please connect your LinkedIn account first. Click on 'LinkedIn Not Connected' in the header to connect.",
        variant: "destructive",
      })
      return { success: false }
    }

    if (!postData.scheduledFor) {
      toast({
        title: "Schedule Date Required",
        description: "Please select a date and time to schedule your post",
        variant: "destructive",
      })
      return { success: false }
    }

    setIsScheduling(true)
    try {
      const response = await fetch("/api/linkedin/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postData.content,
          images: postData.images,
          scheduledFor: postData.scheduledFor.toISOString(),
          userId: typedSession.user.id,
          userEmail: typedSession.user.email,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Scheduled!",
          description: `Your post has been scheduled for ${postData.scheduledFor.toLocaleString()}`,
        })
        // Force session update to refresh LinkedIn connection status
        await update()
        // Refresh credits display
        if (typeof window !== 'undefined' && (window as any).refreshCredits) {
          (window as any).refreshCredits()
        }
        return { success: true }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to schedule post",
          variant: "destructive",
        })
        return { success: false, error: result.message }
      }
    } catch (error) {
      console.error("Error scheduling post:", error)
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      })
      return { success: false, error: "Network error" }
    } finally {
      setIsScheduling(false)
    }
  }

  return {
    postToLinkedIn,
    scheduleLinkedInPost,
    isPosting,
    isScheduling,
    isLinkedInConnected,
  }
}
