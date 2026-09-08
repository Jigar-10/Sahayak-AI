import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useAssessmentStore } from '@/store/assessmentStore'

export function ConsentPage() {
  const navigate = useNavigate()
  const { consent, setConsent, resetAssessment } = useAssessmentStore()
  const [localConsent, setLocalConsent] = useState(consent)

  const allChecked =
    localConsent.purposeUnderstood &&
    localConsent.voluntaryConsent &&
    localConsent.notDiagnosis

  const handleContinue = () => {
    setConsent(localConsent)
    resetAssessment()
    navigate('/assessment')
  }

  const update = (key: keyof typeof localConsent, value: boolean) => {
    setLocalConsent((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="animate-enter mx-auto max-w-3xl px-4 py-12">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">Before you begin</p>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Your Safety and Consent Come First
      </h1>
      <p className="text-muted-foreground mb-8">
        Before we begin, please read how this assessment works and what happens with your
        information.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">What we collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            We ask for basic context about your situation and a narrative in your own words.
            Optional safe-contact details help us reach you only if you choose to provide them.
          </p>
          <p>
            <strong className="text-foreground">What the AI does:</strong> It analyzes language
            patterns to identify stress and vulnerability indicators that may suggest additional
            support is needed.
          </p>
          <p>
            <strong className="text-foreground">What the AI does NOT do:</strong> It does not
            diagnose mental health conditions, determine guilt or credibility, or replace human
            judgement.
          </p>
          <p>
            <strong className="text-foreground">Who can see it:</strong> In this prototype,
            information stays in your browser session only. In a live system, authorized support
            staff would access escalated cases.
          </p>
        </CardContent>
      </Card>

      <fieldset className="space-y-4 mb-8">
        <legend className="sr-only">Consent checkboxes</legend>
        {[
          {
            id: 'purpose',
            key: 'purposeUnderstood' as const,
            label: 'I understand the purpose of this assessment and what information is collected.',
          },
          {
            id: 'voluntary',
            key: 'voluntaryConsent' as const,
            label: 'I give my voluntary consent to proceed with the AI-assisted screening.',
          },
          {
            id: 'diagnosis',
            key: 'notDiagnosis' as const,
            label: 'I understand this is a screening indicator, not a medical or psychological diagnosis.',
          },
        ].map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <Checkbox
              id={item.id}
              checked={localConsent[item.key]}
              onCheckedChange={(checked) => update(item.key, checked === true)}
              aria-required="true"
            />
            <Label htmlFor={item.id} className="leading-relaxed cursor-pointer">
              {item.label}
            </Label>
          </div>
        ))}
      </fieldset>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleContinue} disabled={!allChecked} size="lg">
          Continue to Assessment
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/consent/decline">Decline AI Assessment</Link>
        </Button>
      </div>
    </div>
  )
}
