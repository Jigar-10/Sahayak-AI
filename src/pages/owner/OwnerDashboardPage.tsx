import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService, type BackendDashboardStats } from '@/services/dashboardService'
import {
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Clock,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  Activity,
  HeartHandshake,
  Scale,
  Stethoscope,
  Shield,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const OwnerDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<BackendDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.getStats()
      setStats(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard metrics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Operational Command Center
            </h1>
            <span className="px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Database
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time incident response telemetry, case allocation queue, and emergency helpline monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={loading}
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Link to="/owner/cases">
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
            >
              <span>Manage Cases</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={fetchStats} className="border-red-500/30 text-red-300 text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cases */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Cases Filed</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black tracking-tight text-white">
              {loading ? '—' : stats?.totalCases ?? 0}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>All registered complaint records</span>
          </p>
        </div>

        {/* Active / In Progress */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Pipeline</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black tracking-tight text-amber-300">
              {loading ? '—' : stats?.totalActive ?? 0}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Open, under review, or assigned</span>
          </p>
        </div>

        {/* High & Critical Risk */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">High & Critical Risk</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-red-400">
              {loading ? '—' : (stats?.critical ?? 0) + (stats?.highRisk ?? 0)}
            </span>
            <span className="text-xs text-red-400/80 font-mono">
              ({stats?.critical ?? 0} critical)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Immediate response recommended</span>
          </p>
        </div>

        {/* Resolved / Closed */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cases Resolved</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black tracking-tight text-emerald-400">
              {loading ? '—' : stats?.resolvedCases ?? 0}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed interventions</span>
          </p>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Pending Legal Aid</p>
              <p className="text-lg font-bold text-white">{stats?.pendingLegalAid ?? 0}</p>
            </div>
          </div>
          <span className="text-[11px] text-slate-500">Awaiting Counsel</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Pending Counselling</p>
              <p className="text-lg font-bold text-white">{stats?.pendingCounselling ?? 0}</p>
            </div>
          </div>
          <span className="text-[11px] text-slate-500">Trauma Support</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Emergency Helplines</p>
              <p className="text-lg font-bold text-white">{stats?.emergencyNumbersCount ?? '—'}</p>
            </div>
          </div>
          <Link
            to="/owner/emergency-numbers"
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
          >
            <span>Manage</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Two Column Section: Risk Breakdown & Support Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">Risk Distribution of Active Cases</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">SVI Assessment</span>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.riskDistribution && stats.riskDistribution.length > 0 ? (
              stats.riskDistribution.map((item) => {
                const total = stats.totalActive || 1
                const percent = Math.round((item.value / total) * 100)
                const colorClass =
                  item.category === 'critical'
                    ? 'bg-red-500 text-red-400'
                    : item.category === 'high'
                    ? 'bg-amber-500 text-amber-400'
                    : item.category === 'moderate'
                    ? 'bg-yellow-500 text-yellow-400'
                    : 'bg-emerald-500 text-emerald-400'

                return (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 capitalize">{item.name} Priority</span>
                      <span className="font-mono text-slate-400">
                        {item.value} cases ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colorClass.split(' ')[0]} transition-all duration-500`}
                        style={{ width: `${Math.min(100, Math.max(percent, item.value > 0 ? 4 : 0))}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">No active risk breakdown data yet.</p>
            )}
          </div>
        </div>

        {/* Support Services Allocation Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Support Services Allocation</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Resource Load</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {stats?.supportAllocation && stats.supportAllocation.length > 0 ? (
              stats.supportAllocation.map((service) => {
                const getIcon = (name: string) => {
                  const lower = name.toLowerCase()
                  if (lower.includes('counsel')) return HeartHandshake
                  if (lower.includes('legal')) return Scale
                  if (lower.includes('medical')) return Stethoscope
                  if (lower.includes('police')) return Shield
                  return Eye
                }
                const Icon = getIcon(service.name)

                return (
                  <div
                    key={service.name}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-700/60 text-slate-300 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{service.name}</p>
                      <p className="text-base font-bold text-white">{service.value}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-2 text-xs text-slate-500 italic py-4 text-center">
                No support services allocated yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Fast Operations Navigation</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Access case records, configure emergency contacts, or update your officer credentials.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link to="/owner/cases" className="flex-1 md:flex-none">
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs">
              Open Case Queue
            </Button>
          </Link>
          <Link to="/owner/emergency-numbers" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-200 text-xs">
              Emergency Numbers
            </Button>
          </Link>
          <Link to="/owner/profile" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-200 text-xs">
              Officer Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
