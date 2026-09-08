import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Briefcase,
  FileText,
  HeartHandshake,
  Scale,
  ShieldAlert,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { useCaseStore } from '@/store/caseStore'
import {
  computeCaseKPIs,
  getCasesOverTime,
  getRiskDistribution,
  getSupportAllocation,
  RISK_CHART_COLORS,
} from '@/constants/caseMetrics'

const kpiIcons = [Briefcase, AlertTriangle, ShieldAlert, HeartHandshake, Scale, FileText]

export function CaseDashboardPage() {
  return (
    <ErrorBoundary fallbackTitle="Case dashboard encountered an issue">
      <DashboardContent />
    </ErrorBoundary>
  )
}

function DashboardContent() {
  const cases = useCaseStore((state) => state.cases)
  const kpis = computeCaseKPIs(cases)
  const riskDistribution = getRiskDistribution(cases)
  const casesOverTime = getCasesOverTime(cases)
  const supportAllocation = getSupportAllocation(cases)

  const kpiItems = [
    { label: 'Total Active', value: kpis.totalActive },
    { label: 'Critical', value: kpis.critical },
    { label: 'High Risk', value: kpis.highRisk },
    { label: 'Pending Counselling', value: kpis.pendingCounselling },
    { label: 'Pending Legal Aid', value: kpis.pendingLegalAid },
    { label: 'Emergency Escalations', value: kpis.emergencyEscalations },
  ]

  return (
    <div className="animate-enter mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Operations overview</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Case Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Live case metrics derived from the shared in-memory case store.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/cases">Open Case List</Link>
        </Button>
      </div>

      {kpis.critical > 0 && (
        <div className="mb-6 rounded-2xl border border-critical/30 bg-rose-50/80 p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-critical" aria-hidden="true" />
              <div>
                <p className="font-semibold text-critical">Critical Attention Required</p>
                <p className="text-sm text-muted-foreground">
                  {kpis.critical} case{kpis.critical === 1 ? '' : 's'} require immediate human review.
                </p>
              </div>
            </div>
            <Button asChild variant="destructive">
              <Link to="/cases?risk=critical">Review Critical Cases</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpiItems.map((item, index) => {
          const Icon = kpiIcons[index]
          return (
            <Card key={item.label} className="group">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight">{item.value}</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary transition-transform duration-200 group-hover:scale-110"><Icon className="h-5 w-5" aria-hidden="true" /></div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.category} fill={RISK_CHART_COLORS[entry.category]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cases Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={casesOverTime}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1e3a5f" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Support Allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supportAllocation}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2d8a7e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
