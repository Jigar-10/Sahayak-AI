import { Link, Navigate, useParams } from 'react-router-dom'
import { CalendarClock, FileText, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ExplainableAI } from '@/components/assessment/ExplainableAI'
import { IndicatorList, SVIGauge } from '@/components/assessment/SVIGauge'
import { RiskBadge, StatusBadge } from '@/components/dashboard/CaseStatusBadge'
import { MOCK_OFFICERS } from '@/constants/seedCases'
import { useToast } from '@/components/ui/toast'
import { useCaseStore } from '@/store/caseStore'
import type { AssessmentResult } from '@/types'

export function CaseDetailPage() {
  const { caseId } = useParams()
  const caseRecord = useCaseStore((state) =>
    caseId ? state.getCaseById(caseId) : undefined,
  )
  const assignCase = useCaseStore((state) => state.assignCase)
  const { showToast } = useToast()

  if (!caseRecord) return <Navigate to="/cases" replace />

  const result: AssessmentResult = {
    svi: caseRecord.svi,
    riskCategory: caseRecord.riskCategory,
    indicators: caseRecord.indicators,
    explainableIndicators: caseRecord.explainableIndicators,
    aiConfidence: caseRecord.aiConfidence,
  }

  const handleAssign = (officer: string) => {
    assignCase(caseRecord.id, officer)
    showToast(`${caseRecord.id} assigned to ${officer}.`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Demonstration Data</p>
          <h1 className="text-2xl font-bold">{caseRecord.id}</h1>
          <p className="text-sm text-muted-foreground">
            Case values are read from the same object created during escalation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/cases">Back to Cases</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Created" value={new Date(caseRecord.createdAt).toLocaleString('en-IN')} />
              <DetailItem label="Channel" value={caseRecord.channel} />
              <DetailItem label="Language" value={caseRecord.language.toUpperCase()} />
              <DetailItem label="Incident Category" value={caseRecord.incidentCategory} />
              <DetailItem label="Immediate Danger" value={caseRecord.immediateDanger ? 'Yes' : 'No'} />
              <div>
                <p className="text-xs uppercase text-muted-foreground">Status</p>
                <div className="mt-1"><StatusBadge status={caseRecord.status} /></div>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Risk</p>
                <div className="mt-1"><RiskBadge risk={caseRecord.riskCategory} /></div>
              </div>
              <DetailItem label="Assigned Officer" value={caseRecord.assignedOfficer ?? 'Unassigned'} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                Interaction Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{caseRecord.narrative}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex justify-center">
                <SVIGauge result={result} />
              </div>
              <IndicatorList indicators={caseRecord.indicators} />
            </CardContent>
          </Card>

          <ExplainableAI result={result} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-wrap gap-2 text-sm">
                {caseRecord.recommendedActions.map((action) => (
                  <li key={action} className="rounded-md border border-border bg-surface-muted px-3 py-2 capitalize">
                    {action.replace('-', ' ')}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                Assign Counsellor / Officer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={caseRecord.assignedOfficer ?? ''} onValueChange={handleAssign}>
                <SelectTrigger aria-label="Assign case">
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_OFFICERS.map((officer) => (
                    <SelectItem key={officer} value={officer}>{officer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="h-5 w-5 text-primary" aria-hidden="true" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {caseRecord.timeline.map((event) => (
                  <li key={event.id} className="border-l-2 border-primary/20 pl-4">
                    <p className="text-sm font-medium">{event.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString('en-IN')}
                    </p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}
