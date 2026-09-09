import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Loader2,
  Lock,
  RefreshCw,
  Shield,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ExplainableAI } from '@/components/assessment/ExplainableAI'
import { IndicatorList, SVIGauge } from '@/components/assessment/SVIGauge'
import { RiskBadge } from '@/components/dashboard/CaseStatusBadge'
import { useToast } from '@/components/ui/toast'
import { useAuthStore } from '@/store/authStore'
import { useCaseStore } from '@/store/caseStore'
import { caseService, type CaseUpdate } from '@/services/caseService'
import type { AssessmentResult, CaseRecord, CaseStatus } from '@/types'
import { cn } from '@/lib/utils'

// 6 standard progress milestones
const PROGRESS_STEPS: { key: string; label: string; stageStatus: string }[] = [
  { key: 'submitted', label: 'Complaint Submitted', stageStatus: 'submitted' },
  { key: 'review', label: 'Under Review', stageStatus: 'under-review' },
  { key: 'assigned', label: 'Case Assigned', stageStatus: 'assigned' },
  { key: 'investigation', label: 'Investigation in Progress', stageStatus: 'investigation' },
  { key: 'action', label: 'Action Taken', stageStatus: 'action-taken' },
  { key: 'resolved', label: 'Case Resolved', stageStatus: 'resolved' },
]

export function CaseDetailPage() {
  const { caseId } = useParams()
  const isOwner = useAuthStore((state) => state.isOwner)
  const assignCase = useCaseStore((state) => state.assignCase)
  const { showToast } = useToast()

  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null)
  const [updates, setUpdates] = useState<CaseUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAccessDenied, setIsAccessDenied] = useState(false)
  const [officers, setOfficers] = useState<string[]>([
    'Counsellor Meera Sharma',
    'Counsellor Ananya Patel',
    'Officer Rajesh Kumar',
    'Legal Officer Priya Singh',
    'Protection Officer Vikram Das',
  ])

  // Staff status update state
  const [newStatus, setNewStatus] = useState<string>('')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [postingUpdate, setPostingUpdate] = useState(false)

  const loadCase = async () => {
    if (!caseId) return
    setLoading(true)
    setError(null)
    setIsAccessDenied(false)

    try {
      const record = await caseService.getCaseById(caseId)
      setCaseRecord(record)

      // Fetch case updates
      try {
        const updateList = await caseService.getCaseUpdates(caseId)
        setUpdates(updateList)
      } catch {
        setUpdates(record.updates || [])
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to load case record.'
      if (msg.toLowerCase().includes('denied') || msg.toLowerCase().includes('403') || msg.toLowerCase().includes('permission')) {
        setIsAccessDenied(true)
        setError('Access Denied: You do not have permission to view this case record. Citizen cases are strictly private.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCase()
  }, [caseId])

  useEffect(() => {
    if (isOwner) {
      caseService
        .getOfficers()
        .then((data) => {
          if (data && data.length > 0) setOfficers(data)
        })
        .catch(() => {})
    }
  }, [isOwner])

  const handleAssign = async (officer: string) => {
    if (!caseRecord) return
    try {
      const updated = await caseService.assignOfficer(caseRecord.id, officer)
      setCaseRecord(updated)
      showToast(`${caseRecord.id} assigned to ${officer}.`)
      loadCase()
    } catch {
      await assignCase(caseRecord.id, officer)
      showToast(`${caseRecord.id} assigned to ${officer}.`)
    }
  }

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caseRecord || !newStatus || !statusMessage.trim()) {
      showToast('Please select a status and enter an update message.')
      return
    }

    setPostingUpdate(true)
    try {
      await caseService.addCaseUpdate(caseRecord.id, {
        status: newStatus as CaseStatus,
        title: `Status: ${newStatus.replace('-', ' ').toUpperCase()}`,
        message: statusMessage.trim(),
        department: caseRecord.assignedDepartment,
      })
      showToast('Case update recorded successfully.')
      setNewStatus('')
      setStatusMessage('')
      loadCase()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to post update.')
    } finally {
      setPostingUpdate(false)
    }
  }

  // 1. Loading State
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-5xl flex-col items-center justify-center px-4 py-16 text-muted-foreground space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Verifying access &amp; loading case details from MongoDB...</p>
      </div>
    )
  }

  // 2. Access Denied State (Strict Case Isolation)
  if (isAccessDenied) {
    return (
      <div className="animate-enter mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This case record belongs to another citizen. For safety, confidentiality, and legal privacy, you cannot inspect other users&apos; cases.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button asChild variant="default">
            <Link to="/profile">Back to My Cases</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  // 3. Not Found or Generic Error
  if (error || !caseRecord) {
    return (
      <div className="animate-enter mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Case Record Not Found</h2>
        <p className="text-sm text-muted-foreground">{error || `No case found matching ID "${caseId}".`}</p>
        <Button asChild className="mt-2">
          <Link to="/profile">Return to Profile</Link>
        </Button>
      </div>
    )
  }

  const result: AssessmentResult = {
    svi: caseRecord.svi,
    riskCategory: caseRecord.riskCategory,
    indicators: caseRecord.indicators,
    explainableIndicators: caseRecord.explainableIndicators,
    aiConfidence: caseRecord.aiConfidence,
  }

  // Determine current milestone step index
  const getStepIndex = (statusStr: string) => {
    const s = statusStr.toLowerCase()
    if (s.includes('close') || s.includes('resolve')) return 5
    if (s.includes('action')) return 4
    if (s.includes('investigat')) return 3
    if (s.includes('assign')) return 2
    if (s.includes('under') || s.includes('review')) return 1
    return 0 // submitted
  }

  const currentStepIdx = getStepIndex(String(caseRecord.status))

  return (
    <div className="animate-enter mx-auto max-w-6xl px-4 py-8 lg:px-8 space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-5">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Link to="/profile" aria-label="Back to profile">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                {caseRecord.id}
              </span>
              <StatusBadge status={caseRecord.status} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              {caseRecord.title || caseRecord.incidentCategory}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadCase} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/profile">My Profile</Link>
          </Button>
          {isOwner && (
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard">Staff Dashboard</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Details & Right Progress Stepper */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Details, Description, Indicators */}
        <div className="space-y-6">
          {/* Overview Details Card */}
          <Card className="border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Case Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Category</p>
                <p className="font-medium text-foreground capitalize mt-0.5">
                  {(caseRecord.category || caseRecord.incidentCategory).replace('-', ' ')}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-muted-foreground">Submission Date</p>
                <p className="font-medium text-foreground mt-0.5">
                  {new Date(caseRecord.createdAt).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-muted-foreground">Priority Tier</p>
                <div className="mt-1">
                  <RiskBadge risk={caseRecord.riskCategory} />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-muted-foreground">Assigned Department</p>
                <p className="font-medium text-foreground mt-0.5">{caseRecord.assignedDepartment}</p>
              </div>

              <div>
                <p className="text-xs uppercase text-muted-foreground">Case Officer / Reviewer</p>
                <p className="font-medium text-foreground mt-0.5">
                  {caseRecord.assignedOfficer || 'Awaiting Assignment'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-muted-foreground">Channel</p>
                <p className="font-medium capitalize text-foreground mt-0.5">{caseRecord.channel} Interaction</p>
              </div>
            </CardContent>
          </Card>

          {/* Description & Citizen Narrative */}
          <Card className="border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Case Description &amp; Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {caseRecord.description || caseRecord.narrative || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Chronological Case Updates Feed */}
          <Card className="border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Clock className="h-4 w-4 text-primary" />
                Official Updates &amp; Communications
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time official updates recorded by case workers and grievance departments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {updates.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  No updates recorded yet. Official communications will appear here as your case progresses.
                </div>
              ) : (
                <div className="space-y-3">
                  {updates.map((update, idx) => (
                    <div key={update.id || idx} className="rounded-xl border border-border/80 bg-surface-muted/50 p-4 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={update.status} />
                          <span className="text-xs font-semibold text-foreground">{update.title}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(update.timestamp).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed">{update.message}</p>
                      <p className="text-[11px] text-muted-foreground pt-1 flex items-center gap-1">
                        <span>Updated by:</span>
                        <strong className="text-foreground">{update.updatedBy || 'Case Worker'}</strong>
                        {update.department && <span>({update.department})</span>}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Vulnerability Indicators */}
          <Card className="border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Vulnerability Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <SVIGauge result={result} />
              </div>
              <IndicatorList indicators={caseRecord.indicators} />
            </CardContent>
          </Card>

          <ExplainableAI result={result} />
        </div>

        {/* Right Column: Case Progress Timeline Stepper & Staff Tools */}
        <aside className="space-y-6">
          {/* Case Progress Timeline Stepper */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Shield className="h-4 w-4 text-primary" />
                Case Progress Timeline
              </CardTitle>
              <CardDescription className="text-xs">
                Official milestone progression for this grievance.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-6">
              <ol className="relative space-y-6 before:absolute before:left-3.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-border">
                {PROGRESS_STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStepIdx || (idx === currentStepIdx && currentStepIdx === 5)
                  const isCurrent = idx === currentStepIdx && currentStepIdx !== 5
                  const isFuture = idx > currentStepIdx

                  return (
                    <li key={step.key} className="relative flex items-start gap-3 pl-8">
                      {/* Step Circle Indicator */}
                      <span
                        className={cn(
                          'absolute left-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
                          isCompleted && 'bg-primary text-primary-foreground shadow-xs',
                          isCurrent && 'border-2 border-primary bg-background text-primary ring-4 ring-primary/20',
                          isFuture && 'border border-border bg-surface-muted text-muted-foreground',
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : isCurrent ? (
                          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        ) : (
                          <Circle className="h-3 w-3 opacity-40" />
                        )}
                      </span>

                      {/* Step Info */}
                      <div>
                        <p
                          className={cn(
                            'text-sm font-medium',
                            isCompleted && 'text-foreground font-semibold',
                            isCurrent && 'text-primary font-bold',
                            isFuture && 'text-muted-foreground',
                          )}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-[11px] text-primary/80 font-medium">Currently in this stage</p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </CardContent>
          </Card>

          {/* Caseworker Tools (Visible ONLY to Staff / Owner / Admin) */}
          {isOwner && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <UserCheck className="h-4 w-4 text-primary" />
                  Staff Operations Controls
                </CardTitle>
                <CardDescription className="text-xs">
                  Restricted actions available to authorized case officers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {/* Assign Officer */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Assign Caseworker</label>
                  <Select value={caseRecord.assignedOfficer ?? ''} onValueChange={handleAssign}>
                    <SelectTrigger aria-label="Assign case">
                      <SelectValue placeholder="Select reviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {officers.map((officer) => (
                        <SelectItem key={officer} value={officer}>
                          {officer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Post Official Status & Update */}
                <form onSubmit={handlePostUpdate} className="border-t border-border/60 pt-3 space-y-2">
                  <p className="font-semibold text-foreground">Post Official Progress Update</p>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger aria-label="Update status">
                      <SelectValue placeholder="Choose new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="investigation">Investigation in Progress</SelectItem>
                      <SelectItem value="action-taken">Action Taken</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <textarea
                    rows={2}
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="Enter formal update message for the citizen..."
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground outline-none focus:border-primary"
                  />

                  <Button type="submit" disabled={postingUpdate} size="sm" className="w-full">
                    {postingUpdate ? 'Posting update...' : 'Record Update in MongoDB'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: CaseStatus | string }) {
  const s = String(status).toLowerCase()

  if (s.includes('submit')) {
    return <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs font-semibold">Submitted</span>
  }
  if (s.includes('under') || s.includes('review')) {
    return <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-xs font-semibold">Under Review</span>
  }
  if (s.includes('assign')) {
    return <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-xs font-semibold">Assigned</span>
  }
  if (s.includes('investigat')) {
    return <span className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 text-xs font-semibold">Investigation</span>
  }
  if (s.includes('action')) {
    return <span className="rounded-full bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 text-xs font-semibold">Action Taken</span>
  }
  if (s.includes('resolve')) {
    return <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-semibold">Resolved</span>
  }
  if (s.includes('close')) {
    return <span className="rounded-full bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5 text-xs font-semibold">Closed</span>
  }
  if (s.includes('reject')) {
    return <span className="rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-xs font-semibold">Rejected</span>
  }

  return <span className="rounded-full bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 text-xs font-semibold capitalize">{status}</span>
}
