import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Eye, FilePlus2, ShieldAlert, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { RiskBadge, StatusBadge } from '@/components/dashboard/CaseStatusBadge'
import { MOCK_OFFICERS } from '@/constants/seedCases'
import { getRiskLabel } from '@/constants/sviThresholds'
import { useToast } from '@/components/ui/toast'
import { useCaseStore } from '@/store/caseStore'
import type { CaseStatus, InteractionChannel, RiskCategory } from '@/types'

const riskOptions: (RiskCategory | 'all')[] = ['all', 'low', 'moderate', 'high', 'critical']
const statusOptions: (CaseStatus | 'all')[] = ['all', 'open', 'assigned', 'in-review', 'closed']
const channelOptions: (InteractionChannel | 'all')[] = ['all', 'text', 'voice']

export function CaseListPage() {
  const [searchParams] = useSearchParams()
  const [risk, setRisk] = useState<RiskCategory | 'all'>(
    (searchParams.get('risk') as RiskCategory | null) ?? 'all',
  )
  const [status, setStatus] = useState<CaseStatus | 'all'>('all')
  const [channel, setChannel] = useState<InteractionChannel | 'all'>('all')

  const cases = useCaseStore((state) => state.cases)
  const assignCase = useCaseStore((state) => state.assignCase)
  const addNote = useCaseStore((state) => state.addNote)
  const escalateCase = useCaseStore((state) => state.escalateCase)
  const { showToast } = useToast()

  const filteredCases = useMemo(
    () =>
      cases.filter((caseRecord) => {
        const riskMatch = risk === 'all' || caseRecord.riskCategory === risk
        const statusMatch = status === 'all' || caseRecord.status === status
        const channelMatch = channel === 'all' || caseRecord.channel === channel
        return riskMatch && statusMatch && channelMatch
      }),
    [cases, channel, risk, status],
  )

  const handleAssign = (caseId: string) => {
    const officer = MOCK_OFFICERS[0]
    assignCase(caseId, officer)
    showToast(`${caseId} assigned to ${officer}.`)
  }

  const handleNote = (caseId: string) => {
    addNote(caseId, 'Demo note: human reviewer acknowledged this case for follow-up.')
    showToast(`Note added to ${caseId}.`)
  }

  const handleEscalate = (caseId: string) => {
    escalateCase(caseId)
    showToast(`${caseId} escalated for immediate human review.`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Demonstration Data</p>
          <h1 className="text-2xl font-bold">Case List</h1>
          <p className="text-sm text-muted-foreground">
            Cases shown here are pulled directly from the shared case store.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <Card className="mb-5">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-3">
          <FilterSelect label="Risk Level" value={risk} onValueChange={(value) => setRisk(value as RiskCategory | 'all')}>
            {riskOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === 'all' ? 'All Risk Levels' : getRiskLabel(option)}
              </SelectItem>
            ))}
          </FilterSelect>
          <FilterSelect label="Channel" value={channel} onValueChange={(value) => setChannel(value as InteractionChannel | 'all')}>
            {channelOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === 'all' ? 'All Channels' : option.charAt(0).toUpperCase() + option.slice(1)}
              </SelectItem>
            ))}
          </FilterSelect>
          <FilterSelect label="Status" value={status} onValueChange={(value) => setStatus(value as CaseStatus | 'all')}>
            {statusOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === 'all' ? 'All Statuses' : option.charAt(0).toUpperCase() + option.slice(1)}
              </SelectItem>
            ))}
          </FilterSelect>
        </CardContent>
      </Card>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-surface-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Case ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Language</th>
              <th className="px-4 py-3">SVI</th>
              <th className="px-4 py-3">Risk Level</th>
              <th className="px-4 py-3">Immediate Danger</th>
              <th className="px-4 py-3">Assigned Officer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((caseRecord) => (
              <tr key={caseRecord.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{caseRecord.id}</td>
                <td className="px-4 py-3">{new Date(caseRecord.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 capitalize">{caseRecord.channel}</td>
                <td className="px-4 py-3 uppercase">{caseRecord.language}</td>
                <td className="px-4 py-3 font-semibold">{caseRecord.svi}</td>
                <td className="px-4 py-3"><RiskBadge risk={caseRecord.riskCategory} /></td>
                <td className="px-4 py-3">{caseRecord.immediateDanger ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">{caseRecord.assignedOfficer ?? 'Unassigned'}</td>
                <td className="px-4 py-3"><StatusBadge status={caseRecord.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline" aria-label={`View ${caseRecord.id}`}>
                      <Link to={`/cases/${caseRecord.id}`}>
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleAssign(caseRecord.id)} aria-label={`Assign ${caseRecord.id}`}>
                      <UserCheck className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEscalate(caseRecord.id)} aria-label={`Escalate ${caseRecord.id}`}>
                      <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleNote(caseRecord.id)} aria-label={`Add note to ${caseRecord.id}`}>
                      <FilePlus2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onValueChange,
  children,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  )
}
