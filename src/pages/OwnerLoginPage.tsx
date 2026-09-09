import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, Shield, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'

export function OwnerLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isOwner = useAuthStore((state) => state.isOwner)
  const login = useAuthStore((state) => state.login)
  const authError = useAuthStore((state) => state.error)

  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard'

  if (isOwner) return <Navigate to={from} replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError('')
    setSubmitting(true)

    const success = await login(email, password)
    setSubmitting(false)

    if (success) {
      navigate(from, { replace: true })
    } else {
      setLocalError(authError || 'Invalid credentials. Please verify your email and password.')
    }
  }

  return (
    <div className="animate-enter mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(79,70,229,0.24)]">
            <Shield className="h-6 w-6" aria-hidden="true" />
          </div>
          <CardTitle>Owner / Staff Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Case records and the operational dashboard are restricted to authorized staff.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-2 text-sm font-medium">
              Official email
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="min-h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 outline-none focus-visible:ring-2 focus-visible:ring-ring text-sm"
                  autoComplete="username"
                  required
                />
              </div>
            </label>

            <label className="block space-y-2 text-sm font-medium">
              Password
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 outline-none focus-visible:ring-2 focus-visible:ring-ring text-sm"
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>


            {(localError || authError) && (
              <p className="text-sm text-destructive" role="alert">
                {localError || authError}
              </p>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign in as owner'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
