import {
  Heart,
  Scale,
  Stethoscope,
  Shield,
  Eye,
  CheckCircle2,
} from 'lucide-react'
import { getRecommendationsForRisk } from '@/constants/recommendations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import { useAssessmentStore } from '@/store/assessmentStore'
import { useCaseStore } from '@/store/caseStore'
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
  const { getAssessmentSnapshot, setEscalatedCaseId, escalatedCaseId } = useAssessmentStore()
  const createCase = useCaseStore((s) => s.createCaseFromAssessment)

  const recommendations = getRecommendationsForRisk(result.riskCategory)

  const handleRequest = (title: string) => {
    showToast(`Request sent for ${title} — a team member will follow up.`)
  }

  const handleEscalate = () => {
    if (escalatedCaseId) {
      showToast(`Case ${escalatedCaseId} already created for this assessment.`)
      return
    }
    const assessment = getAssessmentSnapshot()
    const newCase = createCase(assessment)
    setEscalatedCaseId(newCase.id)
    showToast(`Case ${newCase.id} created. A human reviewer will follow up shortly.`)
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

      <div className="grid gap-4 sm:grid-cols-2">
        {recommendations.map((rec) => {
          const Icon = ICON_MAP[rec.icon]
          return (
            <Card key={rec.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  {rec.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={cn(
                    'inline-block rounded-full border px-2 py-0.5 text-xs font-medium mb-2 capitalize',
                    priorityStyles[rec.priority],
                  )}
                >
                  {rec.priority}
                </span>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRequest(rec.title)}
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
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Escalate for Immediate Human Review</h3>
          <p className="text-sm text-muted-foreground">
            A trained human reviewer will examine your assessment and coordinate appropriate
            follow-up support.
          </p>
          {escalatedCaseId ? (
            <div className="flex items-center gap-2 text-accent">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">
                Case created: {escalatedCaseId}
              </span>
            </div>
          ) : (
            <Button onClick={handleEscalate} variant="default" size="lg">
              Escalate for Immediate Human Review
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
