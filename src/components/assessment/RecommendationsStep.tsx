import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Eye,
  Heart,
  Scale,
  Shield,
  Stethoscope,
  Loader2,
  Lock,
} from 'lucide-react'
import { getRecommendationsForRisk } from '@/constants/recommendations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import { useAssessmentStore } from '@/store/assessmentStore'
import { useCaseStore } from '@/store/caseStore'
import { useAuthStore } from '@/store/authStore'
import type { AssessmentResult } from '@/types'

const ICON_MAP = {
  heart: Heart,
  scale: Scale,
  stethoscope: Stethoscope,
  shield: Shield,
  eye: Eye,
}

interface RecommendationsStepProps {
  result: AssessmentResult
}

export function RecommendationsStep({ result }: RecommendationsStepProps) {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { getAssessmentSnapshot, setEscalatedCaseId, escalatedCaseId } = useAssessmentStore()
  const createCase = useCaseStore((state) => state.createCaseFromAssessment)
  const recommendations = getRecommendationsForRisk(result.riskCategory)

  const handleRequest = (title: string) => {
    showToast(`Request sent for ${title}. A team member will follow up.`)
  }

  const handleEscalate = async () => {
    if (!isAuthenticated) {
      showToast('Authentication required. Please sign in to officially register and file your case.')
      navigate('/login?redirect=/apply')
      return
    }

    if (escalatedCaseId) {
      showToast(`Case ${escalatedCaseId} already created for this assessment.`)
      return
    }

    try {
      setIsSubmitting(true)
      const assessment = getAssessmentSnapshot()
      const newCase = await createCase(assessment)
      setEscalatedCaseId(newCase.id)
      showToast(`Case ${newCase.id} created successfully. A human reviewer will follow up shortly.`)
    } catch {
      showToast('Failed to create case. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const priorityStyles = {
    recommended: 'bg-accent/10 text-accent border-accent/30',
    urgent: 'bg-orange-50 text-warning-high border-orange-200',
    critical: 'bg-red-50 text-critical border-red-200',
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Recommended Support</h2>
        <p className="text-sm text-muted-foreground">
          Based on the indicators identified, these support pathways may be helpful for you.
        </p>
      </div>

      <div className="grid gap-4">
        {recommendations.map((recommendation) => {
          const Icon = ICON_MAP[recommendation.icon]

          return (
            <Card key={recommendation.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  {recommendation.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={cn(
                    'mb-2 inline-block rounded-md border px-2 py-0.5 text-xs font-medium capitalize',
                    priorityStyles[recommendation.priority],
                  )}
                >
                  {recommendation.priority}
                </span>
                <p className="text-sm text-muted-foreground">{recommendation.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRequest(recommendation.title)}
                  className="w-full"
                >
                  Request Support
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Card className="border-primary/30">
        <CardContent className="space-y-4 pt-6">
          <h3 className="font-semibold">Escalate for Immediate Human Review</h3>
          <p className="text-sm text-muted-foreground">
            A trained human reviewer will examine your assessment and coordinate appropriate
            follow-up support.
          </p>
          {escalatedCaseId ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm font-medium">Case created: {escalatedCaseId}</span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild variant="default">
                  <Link to="/profile">View in My Cases</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={`/cases/${escalatedCaseId}`}>Track Case Progress</Link>
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={handleEscalate} disabled={isSubmitting} variant="default" size="lg" className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Recording Case in Database...
                </>
              ) : isAuthenticated ? (
                <>
                  <Shield className="h-4 w-4" />
                  Escalate & File Official Case
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Login to File Official Case
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
