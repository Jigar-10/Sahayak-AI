import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import { LockKeyhole, Mail, ShieldCheck, Loader2, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'

export function OwnerLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isOwner = useAuthStore((state) => state.isOwner)
  const ownerLogin = useAuthStore((state) => state.ownerLogin)
  const authError = useAuthStore((state) => state.error)

  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/owner/dashboard'

  if (isOwner) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError('')
    setSubmitting(true)

    const success = await ownerLogin(email.trim(), password)
    setSubmitting(false)

    if (success) {
      navigate(from, { replace: true })
    } else {
      setLocalError(authError || 'Unauthorized: Invalid official email or credentials.')
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Citizen Login</span>
          </Link>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500/80 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            Internal Access
          </span>
        </div>

        <Card className="border-slate-800 bg-slate-900/95 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <CardHeader className="text-center pb-4 pt-6">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20">
              <ShieldCheck className="h-7 w-7" aria-hidden="true" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-white">
              Official Case Officer Login
            </CardTitle>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Restricted portal for verified law enforcement, support administrators, and judicial case officers.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Warning note */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                Unauthorized access attempts to this operational console are strictly logged and monitored under state cyber compliance.
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Official Gov / NGO Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="officer@emotrace.ai"
                    className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-800/80 pl-10 pr-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm transition-all"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Officer Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••••••"
                    className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-800/80 pl-10 pr-10 text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm transition-all"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {(localError || authError) && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{localError || authError}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold rounded-lg shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-slate-950" />
                    Authenticating Credentials...
                  </>
                ) : (
                  'Authorize & Enter Console'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Citizen Notice Footer */}
        <p className="text-center text-xs text-slate-500">
          Looking to report an incident or track your complaint?{' '}
          <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium underline">
            Go to Citizen Portal
          </Link>
        </p>
      </div>
    </div>
  )
}
