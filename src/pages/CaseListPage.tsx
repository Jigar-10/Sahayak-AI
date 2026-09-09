import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, Eye, FilePlus2, Loader2, ShieldAlert, UserCheck } from 'lucide-react'
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
import { getRiskLabel } from '@/constants/sviThresholds'
import { useToast } from '@/components/ui/toast'
import { useCaseStore } from '@/store/caseStore'
import { caseService } from '@/services/caseService'
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
  const [officers, setOfficers] = useState<string[]>([
    'Counsellor Meera Sharma',
    'Counsellor Ananya Patel',
    'Officer Rajesh Kumar',
    'Legal Officer Priya Singh',
    'Protection Officer Vikram Das',
  ])

  const cases = useCaseStore((state) => state.cases)
  const isLoading = useCaseStore((state) => state.isLoading)
  const error = useCaseStore((state) => state.error)
  const fetchCases = useCaseStore((state) => state.fetchCases)
  const assignCase = useCaseStore((state) => state.assignCase)
  const addNote = useCaseStore((state) => state.addNote)
  const escalateCase = useCaseStore((state) => state.escalateCase)
  const { showToast } = useToast()

  // Load cases from backend on mount and when filters change
  useEffect(() => {
    fetchCases({ risk, status, channel })
  }, [risk, status, channel, fetchCases])

  // Load available officers
  useEffect(() => {
    caseService
      .getOfficers()
      .then((data) => {
        if (data && data.length > 0) setOfficers(data)
      })
      .catch(() => {})
  }, [])

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

  const handleAssign = async (caseId: string) => {
    const officer = officers[0]
    await assignCase(caseId, officer)
    showToast(`${caseId} assigned to ${officer}.`)
  }

  const handleNote = async (caseId: string) => {
    await addNote(caseId, 'Official note: caseworker acknowledged case for follow-up review.')
    showToast(`Note added to ${caseId}.`)
  }

  const handleEscalate = async (caseId: string) => {
    await escalateCase(caseId)
    showToast(`${caseId} escalated for immediate human review.`)
  }

  return (
    <div className="animate-enter mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Operations</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Case List</h1>
          <p className="text-sm text-muted-foreground">
            Live cases fetched directly from MongoDB database.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchCases({ risk, status, channel })}>
            Refresh
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      <Card className="mb-5">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-3">
          <FilterSelect
            label="Risk Level"
            value={risk}
            onValueChange={(value) => setRisk(value as RiskCategory | 'all')}
          >
            {riskOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === 'all' ? 'All Risk Levels' : getRiskLabel(option)}
              </SelectItem>
            ))}
          </FilterSelect>
          <FilterSelect
            label="Channel"
            value={channel}
            onValueChange={(value) => setChannel(value as InteractionChannel | 'all')}
          >
            {channelOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === 'all' ? 'All Channels' : option.charAt(0).toUpperCase() + option.slice(1)}
              </SelectItem>
            ))}
          </FilterSelect>
          <FilterSelect
            label="Status"
            value={status}
            onValueChange={(value) => setStatus(value as CaseStatus | 'all')}
          >
            {statusOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === 'all' ? 'All Statuses' : option.charAt(0).toUpperCase() + option.slice(1)}
              </SelectItem>
            ))}
          </FilterSelect>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm">Loading cases from MongoDB...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchCases({ risk, status, channel })}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && filteredCases.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center text-muted-foreground">
          <p className="font-semibold text-foreground">No cases found</p>
          <p className="mt-1 text-sm">No case records in MongoDB matched the selected filter criteria.</p>
        </div>
      )}

      {!isLoading && filteredCases.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-surface shadow-[0_10px_35px_rgba(31,41,75,0.06)]">
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
                  <td className="px-4 py-3">
                    <RiskBadge risk={caseRecord.riskCategory} />
                  </td>
                  <td className="px-4 py-3">{caseRecord.immediateDanger ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{caseRecord.assignedOfficer ?? 'Unassigned'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={caseRecord.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline" aria-label={`View ${caseRecord.id}`}>
                        <Link to={`/cases/${caseRecord.id}`}>
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAssign(caseRecord.id)}
                        aria-label={`Assign ${caseRecord.id}`}
                      >
                        <UserCheck className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEscalate(caseRecord.id)}
                        aria-label={`Escalate ${caseRecord.id}`}
                      >
                        <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleNote(caseRecord.id)}
                        aria-label={`Add note to ${caseRecord.id}`}
                      >
                        <FilePlus2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
