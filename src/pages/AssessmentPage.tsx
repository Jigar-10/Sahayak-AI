import { Link, Navigate } from 'react-router-dom'
import { Shield, Lock, CheckCircle2, UserPlus, LogIn, PhoneCall, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AssessmentWizard } from '@/components/assessment/AssessmentWizard'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { useAssessmentStore } from '@/store/assessmentStore'
import { useAuthStore } from '@/store/authStore'

export function AssessmentPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const consent = useAssessmentStore((s) => s.consent)
  const allConsented =
    consent.purposeUnderstood && consent.voluntaryConsent && consent.notDiagnosis

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // 1. Authentication Wall: Require account creation / sign-in
  if (!isAuthenticated) {
    return (
      <div className="animate-enter mx-auto max-w-2xl px-4 py-12">
        <Card className="border-border/80 shadow-[0_12px_40px_rgba(15,118,110,0.08)]">
          <CardHeader className="text-center space-y-3 pb-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 mx-auto">
              <Shield className="h-3.5 w-3.5" />
              <span>Authentication Required</span>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight md:text-3xl">
              Sign In to Access the Assessment
            </CardTitle>
            <CardDescription className="text-sm max-w-md mx-auto leading-relaxed">
              To protect your confidentiality, safely process sensitive trauma indicators, and save your screening results to your private profile, an account is required.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Why is an account required?
              </p>
              <div className="space-y-2.5 text-sm text-foreground/90">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>100% Confidential & Secure:</strong> Your answers are encrypted and linked only to your private citizen ID.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Personalized Risk Profile:</strong> Review your Stress & Vulnerability Index (SVI) score and tailored recommendations anytime.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Direct Escalation:</strong> Fast-track legal aid applications and grievance filings using your assessment context.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild size="lg" className="flex-1 gap-2 shadow-md">
                <Link to="/register?redirect=/assessment">
                  <UserPlus className="h-4 w-4" />
                  Create an Account
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1 gap-2">
                <Link to="/login?redirect=/assessment">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/60 bg-muted/20 px-6 py-4 rounded-b-xl flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <PhoneCall className="h-4 w-4 text-destructive shrink-0" />
              <span>In immediate danger? You do not need to register.</span>
            </div>
            <Link
              to="/emergency"
              className="text-xs font-semibold text-destructive hover:underline"
            >
              Emergency Helplines &rarr;
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // 2. Consent Check: Ensure mandatory consent is completed
  if (!allConsented) {
    return <Navigate to="/consent" replace />
  }

  // 3. Authenticated & Consented: Show Assessment Wizard
  return (
    <div className="animate-enter mx-auto max-w-4xl px-4 py-10">
      <ErrorBoundary fallbackTitle="Assessment encountered an issue">
        <AssessmentWizard />
      </ErrorBoundary>
    </div>
  )
}
