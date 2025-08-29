"use client"

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TestLinkedInAuth() {
  const [config, setConfig] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch configuration
    fetch('/api/test-linkedin')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => setError(err.message))

    // Get current session
    getSession().then(session => setSession(session))
  }, [])

  const handleLinkedInSignIn = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await signIn('linkedin', { 
        callbackUrl: '/dashboard',
        redirect: false 
      })
      
      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            LinkedIn OAuth Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Debug and test LinkedIn sign-in configuration
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔧 Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {config ? (
                <>
                  <div className="flex justify-between items-center">
                    <span>LinkedIn Client ID:</span>
                    <Badge variant={config.config.linkedinClientId.includes('✅') ? 'default' : 'destructive'}>
                      {config.config.linkedinClientId}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>LinkedIn Client Secret:</span>
                    <Badge variant={config.config.linkedinClientSecret.includes('✅') ? 'default' : 'destructive'}>
                      {config.config.linkedinClientSecret}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>NextAuth URL:</span>
                    <Badge variant={config.config.nextAuthUrl.includes('❌') ? 'destructive' : 'default'}>
                      {config.config.nextAuthUrl}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>NextAuth Secret:</span>
                    <Badge variant={config.config.nextAuthSecret.includes('✅') ? 'default' : 'destructive'}>
                      {config.config.nextAuthSecret}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Environment:</span>
                    <Badge variant="outline">
                      {config.config.environment}
                    </Badge>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Required Redirect URI:</strong><br />
                      <code className="text-xs">{config.config.callbackUrl}</code>
                    </p>
                  </div>
                </>
              ) : (
                <div className="animate-pulse">Loading configuration...</div>
              )}
            </CardContent>
          </Card>

          {/* Test Sign-In */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧪 Test LinkedIn Sign-In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleLinkedInSignIn}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Signing in...' : 'Sign in with LinkedIn'}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              )}

              {session && (
                <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Signed in as:</strong> {session.user?.email}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    LinkedIn Connected: {session.user?.linkedinConnected ? 'Yes' : 'No'}
                  </p>
                </div>
              )}

              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
                <p><strong>Instructions:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Check configuration status above</li>
                  <li>Add the redirect URI to LinkedIn app</li>
                  <li>Click "Sign in with LinkedIn" to test</li>
                  <li>Check browser console for errors</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 How to Fix LinkedIn OAuth Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. LinkedIn App Setup</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Go to <a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn Developers</a></li>
                  <li>Find your app and click on it</li>
                  <li>Go to "Auth" tab</li>
                  <li>Add this redirect URI: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{config?.config.callbackUrl}</code></li>
                  <li>Click "Update" and wait a few minutes</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Environment Variables</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Make sure these are set in your Vercel environment variables:
                </p>
                <div className="mt-2 space-y-1">
                  <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">LINKEDIN_CLIENT_ID=your-linkedin-client-id</code>
                  <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret</code>
                  <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">NEXTAUTH_URL=https://linkzup-advanced-version.vercel.app</code>
                  <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">NEXTAUTH_SECRET=your-nextauth-secret</code>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. OAuth Scopes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Make sure your LinkedIn app has these scopes enabled:
                </p>
                <div className="mt-2 space-y-1">
                  <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">openid</code>
                  <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">profile</code>
                  <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">email</code>
                  <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">w_member_social</code>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Common Issues</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li><strong>redirect_uri does not match:</strong> Add the exact redirect URI to LinkedIn app</li>
                  <li><strong>Invalid client_id:</strong> Check your LinkedIn Client ID and Secret</li>
                  <li><strong>Unauthorized:</strong> Check if the required scopes are enabled</li>
                  <li><strong>No popup:</strong> Check browser console and disable popup blockers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
