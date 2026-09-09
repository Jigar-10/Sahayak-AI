import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, Mail, Shield, Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/toast'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [localError, setLocalError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isOwner = useAuthStore((state) => state.isOwner)
  const login = useAuthStore((state) => state.login)
  const authError = useAuthStore((state) => state.error)
  const { showToast } = useToast()

  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const redirectParam = searchParams.get('redirect')
  const locationStateFrom = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
  const statePath = locationStateFrom ? `${locationStateFrom.pathname || ''}${locationStateFrom.search || ''}` : null
  const from = redirectParam || statePath || (isOwner ? '/dashboard' : '/profile')

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError('')

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password.')
      return
    }

    setSubmitting(true)
    const success = await login(email.trim(), password)
    setSubmitting(false)

    if (success) {
      showToast('Signed in successfully. Welcome back!')
      navigate(from, { replace: true })
    } else {
      setLocalError(authError || 'Invalid credentials. Please verify your email and password.')
    }
  }

  return (
    <div className="animate-enter mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-12">
      <Card className="w-full border-border/80 shadow-[0_12px_40px_rgba(15,118,110,0.08)]">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(15,118,110,0.3)]">
            <Shield className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-sm">
            Sign in to access your profile, file a grievance, and track your case updates.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Official Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className="min-h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="min-h-11 w-full rounded-xl border border-border bg-background pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none p-0.5 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              />
              <label htmlFor="rememberMe" className="text-xs text-muted-foreground cursor-pointer select-none">
                Remember my login credentials on this device
              </label>
            </div>

            {(localError || authError) && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive flex items-start gap-2" role="alert">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{localError || authError}</span>
              </div>
            )}

            <Button type="submit" disabled={submitting} className="w-full min-h-11 text-sm font-semibold rounded-xl">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying credentials...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col border-t border-border/70 pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to={redirectParam ? `/register?redirect=${encodeURIComponent(redirectParam)}` : '/register'}
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Forgot Password Helper Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Password Assistance</CardTitle>
              <CardDescription className="text-xs">
                Citizen & Staff Account Security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>• Please enter your registered email address and password to access your account.</p>
              <p>• To ensure confidentiality and data safety, account resets require verification by the grievance redressal team.</p>
              <p>• To request assistance, please reach out to the Sahayak AI helpdesk support team.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setShowForgotModal(false)} className="w-full" size="sm">
                Understood
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
