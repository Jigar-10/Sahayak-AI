import { Navigate } from 'react-router-dom'
import { AssessmentWizard } from '@/components/assessment/AssessmentWizard'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { useAssessmentStore } from '@/store/assessmentStore'

export function AssessmentPage() {
  const consent = useAssessmentStore((s) => s.consent)
  const allConsented =
    consent.purposeUnderstood && consent.voluntaryConsent && consent.notDiagnosis

  if (!allConsented) {
    return <Navigate to="/consent" replace />
  }

  return (
    <div className="animate-enter mx-auto max-w-4xl px-4 py-10">
      <ErrorBoundary fallbackTitle="Assessment encountered an issue">
        <AssessmentWizard />
      </ErrorBoundary>
    </div>
  )
}
