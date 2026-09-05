import { FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LockKeyhole, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'

export function OwnerLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const isOwner = useAuthStore((state) => state.isOwner)
  const loginAsOwner = useAuthStore((state) => state.loginAsOwner)
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard'

  if (isOwner) return <Navigate to={from} replace />

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (loginAsOwner(password)) {
      navigate(from, { replace: true })
      return
    }

    setError('Invalid owner credentials.')
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
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
              Owner password
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <Button type="submit" className="w-full">Sign in as owner</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
