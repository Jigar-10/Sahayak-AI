import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { caseService } from '@/services/caseService'
import type { CaseRecord, CaseStatus, RiskCategory } from '@/types'
import {
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  Siren,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const OwnerCasesPage: React.FC = () => {
  const [cases, setCases] = useState<CaseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest-risk'>('newest')

  const fetchCases = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await caseService.getCases()
      setCases(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cases.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [])

  // Filter & Search Logic
  const filteredCases = useMemo(() => {
    return cases
      .filter((c) => {
        // Risk / Emergency Filter
        if (riskFilter === 'emergency') {
          if (!c.isEmergency) return false
        } else if (riskFilter !== 'all' && c.riskCategory !== riskFilter) {
          return false
        }

        // Status Filter
        if (statusFilter !== 'all') {
          const s = (c.status || '').toLowerCase()
          if (statusFilter === 'open' && s !== 'open' && s !== 'submitted') return false
          if (statusFilter === 'in-review' && s !== 'in-review' && s !== 'under-review') return false
          if (statusFilter === 'assigned' && s !== 'assigned' && s !== 'investigation' && s !== 'action-taken') return false
          if (statusFilter === 'closed' && s !== 'closed' && s !== 'resolved') return false
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const caseId = (c.caseNumber || c.id || '').toLowerCase()
          const category = (c.incidentCategory || c.category || '').toLowerCase()
          const narrative = (c.narrative || c.description || '').toLowerCase()
          const officer = (c.assignedOfficer || '').toLowerCase()

          return (
            caseId.includes(q) ||
            category.includes(q) ||
            narrative.includes(q) ||
            officer.includes(q)
          )
        }

        return true
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        }
        if (sortOrder === 'oldest') {
          return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime()
        }
        if (sortOrder === 'highest-risk') {
          const weight: Record<string, number> = { critical: 4, high: 3, moderate: 2, low: 1 }
          return (weight[b.riskCategory] || 0) - (weight[a.riskCategory] || 0)
        }
        return 0
      })
  }, [cases, searchQuery, riskFilter, statusFilter, sortOrder])

  const getRiskBadge = (risk: RiskCategory | string) => {
    switch (risk?.toLowerCase()) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
            Critical Risk
          </span>
        )
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
            High Risk
          </span>
        )
      case 'moderate':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
            Moderate Risk
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Low Risk
          </span>
        )
    }
  }

  const getStatusBadge = (status: CaseStatus | string) => {
    const s = (status || '').toLowerCase()
    if (s === 'closed' || s === 'resolved') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Resolved</span>
        </span>
      )
    }
    if (s === 'assigned' || s === 'investigation' || s === 'action-taken') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
          <UserCheck className="w-3 h-3" />
          <span>Assigned</span>
        </span>
      )
    }
    if (s === 'in-review' || s === 'under-review') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>In Review</span>
        </span>
      )
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>Submitted / Open</span>
      </span>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Case Management Operations
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium border border-slate-700">
              {filteredCases.length} records
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review citizen incident filings, assign investigating officers, and push progress updates.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchCases}
          disabled={loading}
          className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Refresh Queue</span>
        </Button>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by case ID, category, narrative snippet, or officer..."
              className="w-full h-10 rounded-xl bg-slate-800/80 border border-slate-700 pl-9 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="h-10 rounded-xl bg-slate-800 border border-slate-700 px-3 text-xs text-slate-200 outline-none focus:border-amber-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="emergency">🚨 Emergency SOS Only</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="low">Low Risk</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl bg-slate-800 border border-slate-700 px-3 text-xs text-slate-200 outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open / Submitted</option>
              <option value="in-review">In Review</option>
              <option value="assigned">Assigned</option>
              <option value="closed">Resolved / Closed</option>
            </select>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="h-10 rounded-xl bg-slate-800 border border-slate-700 px-3 text-xs text-slate-200 outline-none focus:border-amber-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest-risk">Highest Risk First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Case Records List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
          <p className="text-sm text-slate-400 font-medium">Loading case pipeline from database...</p>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No matching cases found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || riskFilter !== 'all' || statusFilter !== 'all'
              ? 'Try changing your search keywords or resetting the active filters.'
              : 'There are currently no complaints in the case database.'}
          </p>
          {(searchQuery || riskFilter !== 'all' || statusFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setRiskFilter('all')
                setStatusFilter('all')
              }}
              className="border-slate-700 text-slate-300 text-xs mt-2"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCases.map((c) => {
            const caseId = c.caseNumber || c.id
            const dateStr = c.createdAt
              ? new Date(c.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Date recorded'

            return (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md group flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left Side: Case Meta & Narrative Snippet */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                      {caseId}
                    </span>
                    {c.isEmergency && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white flex items-center gap-1 shadow-sm shadow-red-500/30 animate-pulse">
                        <Siren className="w-3 h-3" />
                        <span>Emergency SOS</span>
                      </span>
                    )}
                    {getRiskBadge(c.riskCategory)}
                    {getStatusBadge(c.status)}
                    {c.latitude && c.longitude && (
                      <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <MapPin className="w-3 h-3 text-red-400" />
                        <span>GPS: {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}</span>
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-mono">{dateStr}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {c.incidentCategory || c.category || 'Citizen Incident Filing'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {c.narrative || c.description || 'No detailed narrative provided.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">SVI Score:</span>
                      <span className="font-mono font-semibold text-slate-200">
                        {typeof c.svi === 'number' ? c.svi.toFixed(2) : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Officer:</span>
                      <span className="font-medium text-slate-200">
                        {c.assignedOfficer || 'Unassigned'}
                      </span>
                    </div>

                    {c.escalated && (
                      <span className="flex items-center gap-1 text-red-400 font-semibold text-[11px]">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Escalated
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side: Action Button */}
                <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t border-slate-800/80 lg:border-t-0">
                  <Link to={`/owner/cases/${c.id}`} className="w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-amber-500 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>Review & Update</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
