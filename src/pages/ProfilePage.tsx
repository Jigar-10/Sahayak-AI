import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit3,
  ExternalLink,
  FileText,
  Loader2,
  LogOut,
  Mail,
  Phone,
  PlusCircle,
  RefreshCw,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { caseService } from '@/services/caseService'
import { useToast } from '@/components/ui/toast'
import type { CaseRecord, CaseStatus } from '@/types'
import { cn } from '@/lib/utils'

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const isOwner = useAuthStore((state) => state.isOwner)
  const logout = useAuthStore((state) => state.logout)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [cases, setCases] = useState<CaseRecord[]>([])
  const [loadingCases, setLoadingCases] = useState(true)
  const [caseError, setCaseError] = useState<string | null>(null)
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'resolved'>('all')

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // Logout confirmation state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const loadMyCases = async () => {
    setLoadingCases(true)
    setCaseError(null)
    try {
      const data = await caseService.getMyCases()
      setCases(data)
    } catch (err: unknown) {
      setCaseError(err instanceof Error ? err.message : 'Unable to load your registered cases.')
    } finally {
      setLoadingCases(false)
    }
  }

  useEffect(() => {
    loadMyCases()
  }, [])

  const handleOpenEdit = () => {
    setEditName(user?.name || '')
    setEditPhone(user?.phone || '')
    setIsEditing(true)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) {
      showToast('Name cannot be empty')
      return
    }
    setSavingProfile(true)
    const ok = await updateProfile(editName.trim(), editPhone.trim())
    setSavingProfile(false)
    if (ok) {
      showToast('Profile updated successfully.')
      setIsEditing(false)
    } else {
      showToast('Failed to update profile. Please try again.')
    }
  }

  const handleLogout = async () => {
    await logout()
    showToast('Signed out successfully.')
    navigate('/login')
  }

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const isResolved = c.status === 'closed' || (c.status as string) === 'resolved'
    if (filterTab === 'active') return !isResolved
    if (filterTab === 'resolved') return isResolved
    return true
  })

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="animate-enter mx-auto max-w-6xl px-4 py-8 lg:px-8 space-y-8">
      {/* 1. Profile Header Card */}
      <Card className="border-border/80 shadow-[0_10px_30px_rgba(15,118,110,0.06)] overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/90 via-primary to-teal-700 relative" />
        <CardContent className="pt-0 relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-background bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
                    {user?.name || 'Citizen User'}
                  </h1>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                    {isOwner ? 'Authorized Case Officer' : 'Verified Citizen'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  Account ID: <span className="font-mono">{user?.id || 'USR-2026-ONLINE'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={handleOpenEdit} variant="outline" size="sm" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button onClick={() => setShowLogoutConfirm(true)} variant="outline" size="sm" className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* User Information Grid */}
          <div className="grid gap-3 sm:grid-cols-3 border-t border-border/70 pt-4 text-sm">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="rounded-lg bg-surface-muted p-2 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Official Email</p>
                <p className="font-medium text-foreground truncate">{user?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="rounded-lg bg-surface-muted p-2 text-primary">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Contact Phone</p>
                <p className="font-medium text-foreground">{user?.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="rounded-lg bg-surface-muted p-2 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Registered Cases</p>
                <p className="font-medium text-foreground">{cases.length} Case{cases.length === 1 ? '' : 's'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. My Cases Section */}
      <section className="space-y-4" aria-labelledby="my-cases-heading">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 id="my-cases-heading" className="text-2xl font-bold tracking-tight text-foreground">
              My Registered Cases
            </h2>
            <p className="text-sm text-muted-foreground">
              Confidential grievances registered under your account. Data is strictly isolated and accessible only by you.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadMyCases} className="gap-1.5" disabled={loadingCases}>
              <RefreshCw className={cn('h-3.5 w-3.5', loadingCases && 'animate-spin')} />
              Refresh
            </Button>
            <Button asChild size="sm" className="gap-1.5 rounded-xl font-semibold">
              <Link to="/apply">
                <PlusCircle className="h-4 w-4" />
                + File New Complaint
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-border/70 pb-2 text-sm">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg font-medium transition',
              filterTab === 'all'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
            )}
          >
            All Cases ({cases.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('active')}
            className={cn(
              'px-3 py-1.5 rounded-lg font-medium transition',
              filterTab === 'active'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
            )}
          >
            Active ({cases.filter((c) => c.status !== 'closed' && (c.status as string) !== 'resolved').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('resolved')}
            className={cn(
              'px-3 py-1.5 rounded-lg font-medium transition',
              filterTab === 'resolved'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
            )}
          >
            Resolved ({cases.filter((c) => c.status === 'closed' || (c.status as string) === 'resolved').length})
          </button>
        </div>

        {/* Loading State */}
        {loadingCases && (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center text-muted-foreground space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm font-medium">Retrieving your secure case records from MongoDB...</p>
          </div>
        )}

        {/* Error State */}
        {caseError && !loadingCases && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <h3 className="text-base font-semibold text-destructive">Unable to load your cases</h3>
            <p className="text-sm text-muted-foreground">{caseError}</p>
            <Button onClick={loadMyCases} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loadingCases && !caseError && filteredCases.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">You don't have any registered cases yet.</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                Whenever you complete a confidential assessment or escalate an incident, it will safely appear here for tracking.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button asChild size="lg" className="gap-2 rounded-xl font-semibold shadow-sm">
                <Link to="/apply">
                  <PlusCircle className="h-4 w-4" />
                  File a New Complaint
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <Link to="/consent">
                  Take Safe Assessment
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Cases List */}
        {!loadingCases && !caseError && filteredCases.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCases.map((caseRecord) => {
              const formattedDate = new Date(caseRecord.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })

              return (
                <Card key={caseRecord.id} className="flex flex-col border-border/80 hover:border-primary/50 transition-all hover:shadow-[0_8px_25px_rgba(15,118,110,0.08)] group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-primary tracking-wider uppercase">
                          {caseRecord.id}
                        </span>
                        <CardTitle className="text-base font-bold text-foreground mt-0.5 group-hover:text-primary transition-colors line-clamp-1">
                          {caseRecord.title || caseRecord.incidentCategory}
                        </CardTitle>
                      </div>
                      <StatusBadge status={caseRecord.status} />
                    </div>
                    <CardDescription className="text-xs line-clamp-2 mt-1">
                      {caseRecord.narrative || caseRecord.description || 'No detailed narrative recorded.'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="mt-auto pt-0 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/60 pt-3">
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Submitted
                        </p>
                        <p className="font-medium text-foreground mt-0.5">{formattedDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Shield className="h-3 w-3" /> Priority Tier
                        </p>
                        <p className="font-medium capitalize text-foreground mt-0.5">
                          {caseRecord.priority || caseRecord.riskCategory} Risk
                        </p>
                      </div>
                    </div>

                    {caseRecord.updates && caseRecord.updates.length > 0 && (
                      <div className="rounded-lg bg-surface-muted/60 px-2.5 py-1.5 text-[11px] border border-border/60">
                        <span className="font-semibold text-primary">Latest: </span>
                        <span className="text-foreground">{caseRecord.updates[caseRecord.updates.length - 1].title}: </span>
                        <span className="text-muted-foreground line-clamp-1">{caseRecord.updates[caseRecord.updates.length - 1].message}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {caseRecord.assignedOfficer ? caseRecord.assignedOfficer : 'Grievance Redressal Cell'}
                      </p>
                      <Button asChild size="sm" variant="default" className="gap-1.5 rounded-lg text-xs font-semibold">
                        <Link to={`/cases/${caseRecord.id}`}>
                          View Details
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* Edit Profile Modal Dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md animate-enter">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Edit Profile Information</CardTitle>
              <CardDescription className="text-xs">
                Update your contact details for official grievance follow-ups.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="editName" className="text-xs font-medium text-foreground">
                    Full Name
                  </label>
                  <input
                    id="editName"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="min-h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="editPhone" className="text-xs font-medium text-foreground">
                    Contact Phone
                  </label>
                  <input
                    id="editPhone"
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="9876543210"
                    className="min-h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={savingProfile} size="sm">
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-sm animate-enter">
            <CardHeader>
              <CardTitle className="text-base font-bold text-destructive flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Confirm Sign Out
              </CardTitle>
              <CardDescription className="text-xs">
                Are you sure you want to end your current authenticated session?
              </CardDescription>
            </CardHeader>
            <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-3">
              <Button variant="outline" size="sm" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: CaseStatus | string }) {
  const s = String(status).toLowerCase()

  if (s.includes('submit')) {
    return <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold">Submitted</span>
  }
  if (s.includes('under') || s.includes('review')) {
    return <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold">Under Review</span>
  }
  if (s.includes('assign')) {
    return <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 text-xs font-semibold">Assigned</span>
  }
  if (s.includes('investigat')) {
    return <span className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 text-xs font-semibold">Investigation</span>
  }
  if (s.includes('action')) {
    return <span className="rounded-full bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-0.5 text-xs font-semibold">Action Taken</span>
  }
  if (s.includes('resolve')) {
    return <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">Resolved</span>
  }
  if (s.includes('close')) {
    return <span className="rounded-full bg-gray-100 text-gray-700 border border-gray-300 px-2.5 py-0.5 text-xs font-semibold">Closed</span>
  }
  if (s.includes('reject')) {
    return <span className="rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 text-xs font-semibold">Rejected</span>
  }

  return <span className="rounded-full bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 text-xs font-semibold capitalize">{status}</span>
}
