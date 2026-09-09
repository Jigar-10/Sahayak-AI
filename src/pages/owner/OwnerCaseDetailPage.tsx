import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { caseService } from '@/services/caseService'
import { useAuthStore } from '@/store/authStore'
import type { CaseRecord, CaseStatus, RiskCategory } from '@/types'
import {
  ArrowLeft,
  ShieldAlert,
  UserCheck,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Send,
  Plus,
  Loader2,
  Flame,
  Building,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const OwnerCaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null)
  const [officers, setOfficers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // Officer Assignment State
  const [selectedOfficer, setSelectedOfficer] = useState('')
  const [customOfficer, setCustomOfficer] = useState('')
  const [assigning, setAssigning] = useState(false)

  // Status Change State
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus>('open')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // New Progress Update State
  const [updateTitle, setUpdateTitle] = useState('')
  const [updateMessage, setUpdateMessage] = useState('')
  const [updateDept, setUpdateDept] = useState('Central Case Cell')
  const [addingUpdate, setAddingUpdate] = useState(false)

  // Internal Note State
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  // Escalation State
  const [escalating, setEscalating] = useState(false)

  const fetchCaseDetails = async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const [caseData, officerList] = await Promise.all([
        caseService.getCaseById(id),
        caseService.getOfficers().catch(() => ['Special Unit Officer', 'Legal Counsel Cell', 'Psychological Aid Team']),
      ])
      setCaseRecord(caseData)
      setSelectedStatus(caseData.status || 'open')
      setSelectedOfficer(caseData.assignedOfficer || '')
      setOfficers(officerList || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve case file.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCaseDetails()
  }, [id])

  // Handlers
  const handleAssignOfficer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    const officerToAssign = customOfficer.trim() || selectedOfficer
    if (!officerToAssign) return

    try {
      setAssigning(true)
      const updated = await caseService.assignOfficer(id, officerToAssign)
      setCaseRecord(updated)
      setSelectedOfficer(updated.assignedOfficer || officerToAssign)
      setCustomOfficer('')
      setActionSuccess(`Officer successfully assigned: ${officerToAssign}`)
      setTimeout(() => setActionSuccess(null), 4000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to assign officer.')
    } finally {
      setAssigning(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!id || !selectedStatus) return
    try {
      setUpdatingStatus(true)
      const updated = await caseService.updateStatus(id, selectedStatus)
      setCaseRecord(updated)
      setActionSuccess(`Case status updated to "${selectedStatus}".`)
      setTimeout(() => setActionSuccess(null), 4000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update case status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAddCaseUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !updateTitle.trim() || !updateMessage.trim()) return

    try {
      setAddingUpdate(true)
      const updated = await caseService.addCaseUpdate(id, {
        title: updateTitle.trim(),
        message: updateMessage.trim(),
        department: updateDept.trim(),
        updatedBy: user?.name || 'Authorized Officer',
        status: caseRecord?.status || 'in-review',
      })
      setCaseRecord(updated)
      setUpdateTitle('')
      setUpdateMessage('')
      setActionSuccess('Official progress update pushed to citizen timeline.')
      setTimeout(() => setActionSuccess(null), 4000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add case update.')
    } finally {
      setAddingUpdate(false)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !noteText.trim()) return

    try {
      setAddingNote(true)
      const updated = await caseService.addNote(id, noteText.trim(), user?.name || 'Staff Note')
      setCaseRecord(updated)
      setNoteText('')
      setActionSuccess('Confidential officer note recorded.')
      setTimeout(() => setActionSuccess(null), 4000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to append internal note.')
    } finally {
      setAddingNote(false)
    }
  }

  const handleEscalate = async () => {
    if (!id) return
    try {
      setEscalating(true)
      const updated = await caseService.escalateCase(id)
      setCaseRecord(updated)
      setActionSuccess('Emergency escalation protocol triggered for this incident.')
      setTimeout(() => setActionSuccess(null), 4000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to escalate case.')
    } finally {
      setEscalating(false)
    }
  }

  const getRiskBadge = (risk: RiskCategory | string) => {
    switch (risk?.toLowerCase()) {
      case 'critical':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40">
            Critical Risk
          </span>
        )
      case 'high':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
            High Risk
          </span>
        )
      case 'moderate':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
            Moderate Risk
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            Low Risk
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400 mx-auto" />
        <p className="text-sm text-slate-400 font-medium">Loading case file from secure storage...</p>
      </div>
    )
  }

  if (error || !caseRecord) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Unable to Open Case File</h2>
        <p className="text-sm text-slate-400">{error || 'Case record not found in system.'}</p>
        <div className="pt-2">
          <Button onClick={() => navigate('/owner/cases')} variant="outline" className="border-slate-700 text-slate-200">
            Return to Case Queue
          </Button>
        </div>
      </div>
    )
  }

  const caseId = caseRecord.caseNumber || caseRecord.id

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Breadcrumb & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/owner/cases"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                {caseId}
              </span>
              {getRiskBadge(caseRecord.riskCategory)}
              {caseRecord.escalated && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500 text-white flex items-center gap-1 shadow-md shadow-red-500/20">
                  <Flame className="w-3.5 h-3.5" />
                  Escalated
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {caseRecord.incidentCategory || caseRecord.category || 'Incident File'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!caseRecord.escalated && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleEscalate}
              disabled={escalating}
              className="border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>{escalating ? 'Escalating...' : 'Trigger Urgent Escalation'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Success Banner */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid: Left = Case Intel, Right = Action Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Incident Narrative, Indicators & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Narrative Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-200">
                <FileText className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold">Incident Narrative & Deposition</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Filed:{' '}
                {caseRecord.createdAt ? new Date(caseRecord.createdAt).toLocaleString() : 'Recent'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {caseRecord.narrative || caseRecord.description || 'No detailed deposition recorded.'}
            </div>

            {/* Assessment Meta Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <span className="text-[11px] text-slate-400 block">SVI Assessment</span>
                <span className="text-base font-bold font-mono text-amber-300">
                  {typeof caseRecord.svi === 'number' ? caseRecord.svi.toFixed(2) : 'N/A'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <span className="text-[11px] text-slate-400 block">AI Confidence</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {caseRecord.aiConfidence ? `${Math.round(caseRecord.aiConfidence * 100)}%` : '85%'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <span className="text-[11px] text-slate-400 block">Channel</span>
                <span className="text-sm font-semibold capitalize text-slate-200">
                  {caseRecord.channel || 'Online Web Form'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <span className="text-[11px] text-slate-400 block">Immediate Danger</span>
                <span
                  className={`text-sm font-bold ${
                    caseRecord.immediateDanger ? 'text-red-400' : 'text-slate-300'
                  }`}
                >
                  {caseRecord.immediateDanger ? 'YES - High Threat' : 'No Immediate Threat'}
                </span>
              </div>
            </div>

            {/* AI Indicators */}
            {caseRecord.explainableIndicators && caseRecord.explainableIndicators.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Identified SVI Indicators
                </span>
                <div className="flex flex-wrap gap-2">
                  {caseRecord.explainableIndicators.map((ind, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs border border-slate-700/60"
                    >
                      • {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Citizen Updates Timeline */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-200">
                <Clock className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold">Case Progression Timeline (Visible to Citizen)</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {caseRecord.updates?.length || 0} milestones
              </span>
            </div>

            {caseRecord.updates && caseRecord.updates.length > 0 ? (
              <div className="space-y-4 pt-2">
                {caseRecord.updates.map((update) => (
                  <div
                    key={update.id}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2 relative pl-5 before:absolute before:left-2 before:top-4 before:bottom-4 before:w-0.5 before:bg-amber-500/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{update.title}</span>
                        {update.department && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-medium">
                            {update.department}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {update.timestamp ? new Date(update.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{update.message}</p>
                    <div className="text-[11px] text-slate-500 pt-1">Logged by: {update.updatedBy}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No official updates posted yet. Use the action panel on the right to post a case update.
              </p>
            )}
          </div>

          {/* Internal Confidential Staff Notes */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldAlert className="w-5 h-5 text-yellow-400" />
                <h2 className="text-base font-bold">Confidential Officer Notes (Internal Only)</h2>
              </div>
              <span className="text-xs text-amber-400/80 font-mono">Restricted to Staff</span>
            </div>

            {caseRecord.notes && caseRecord.notes.length > 0 ? (
              <div className="space-y-3 pt-2">
                {caseRecord.notes.map((note) => (
                  <div key={note.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-300">{note.author}</span>
                      <span className="text-slate-500 font-mono">
                        {note.timestamp ? new Date(note.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2 text-center">No confidential notes appended.</p>
            )}

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">Append Internal Note</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Confidential observations, evidence log notes, or coordination memos..."
                rows={2}
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 p-3 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500"
                required
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={addingNote || !noteText.trim()}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                >
                  {addingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Plus className="w-3.5 h-3.5 mr-1" />}
                  Record Note
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Operational Action Controls */}
        <div className="space-y-6">
          {/* Status Update Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Update Case Lifecycle Status</span>
            </h3>

            <div className="space-y-3">
              <label className="block text-xs text-slate-400">Select Workflow Stage</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as CaseStatus)}
                className="w-full h-10 rounded-xl bg-slate-800 border border-slate-700 px-3 text-sm text-slate-200 outline-none focus:border-amber-500"
              >
                <option value="open">Open / Intake</option>
                <option value="in-review">In Review / Triage</option>
                <option value="assigned">Assigned / Investigation Active</option>
                <option value="closed">Closed / Resolved</option>
              </select>

              <Button
                onClick={handleUpdateStatus}
                disabled={updatingStatus || selectedStatus === caseRecord.status}
                className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Case Status
              </Button>
            </div>
          </div>

          {/* Officer Assignment Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Assign Investigating Officer</span>
            </h3>

            <form onSubmit={handleAssignOfficer} className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs text-slate-400">Current Assigned Officer</label>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-amber-300">
                  {caseRecord.assignedOfficer || 'Currently Unassigned'}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-400">Choose from Active Duty Roster</label>
                <select
                  value={selectedOfficer}
                  onChange={(e) => {
                    setSelectedOfficer(e.target.value)
                    setCustomOfficer('')
                  }}
                  className="w-full h-10 rounded-xl bg-slate-800 border border-slate-700 px-3 text-sm text-slate-200 outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Officer --</option>
                  {officers.map((off) => (
                    <option key={off} value={off}>
                      {off}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-400">Or Custom Officer / Badge Name</label>
                <input
                  type="text"
                  value={customOfficer}
                  onChange={(e) => setCustomOfficer(e.target.value)}
                  placeholder="e.g. Inspector R. Sharma (Cyber Cell)"
                  className="w-full h-10 rounded-xl bg-slate-800 border border-slate-700 px-3 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500"
                />
              </div>

              <Button
                type="submit"
                disabled={assigning || (!selectedOfficer && !customOfficer.trim())}
                className="w-full h-10 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700"
              >
                {assigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Confirm Officer Assignment
              </Button>
            </form>
          </div>

          {/* Push Public Progress Update Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Case Update to Citizen</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Updates added here are immediately rendered in the citizen's case tracking timeline.
            </p>

            <form onSubmit={handleAddCaseUpdate} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs text-slate-400">Update Title / Action Taken</label>
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  placeholder="e.g. FIR Registered / Medical Team Dispatched"
                  className="w-full h-9 rounded-xl bg-slate-800 border border-slate-700 px-3 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-slate-400">Department Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={updateDept}
                    onChange={(e) => setUpdateDept(e.target.value)}
                    placeholder="e.g. Cyber Crime Cell"
                    className="w-full h-9 rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-slate-400">Public Status Message</label>
                <textarea
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                  placeholder="Explain current investigation progress and next steps clearly for the complainant..."
                  rows={3}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={addingUpdate || !updateTitle.trim() || !updateMessage.trim()}
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
              >
                {addingUpdate ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-3.5 h-3.5 mr-1.5" />}
                Post Milestone Update
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
