import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Shield,
  User,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  ArrowLeft,
  Calendar,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { caseService } from '@/services/caseService'
import { getDeviceLocation } from '@/services/emergencyLocationService'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

const COMPLAINT_CATEGORIES = [
  'Harassment & Abuse',
  'Domestic Violence & Safety Threat',
  'Workplace Discrimination & Exploitation',
  'Caste-based Discrimination or Violence',
  'Cyber Harassment & Digital Stalking',
  'Physical Assault & Endangerment',
  'Legal Aid & Protective Injunction',
  'Emergency Housing & Medical Assistance',
  'General Citizen Grievance',
]

const DEPARTMENTS = [
  'Citizen Support & Redressal Cell',
  'Women Safety & Family Welfare Wing',
  'Workplace Anti-Harassment Committee',
  'Legal Aid & Human Rights Cell',
  'Cyber Crime & Digital Safety Desk',
  'Emergency Response & Redressal Cell',
]

export function ApplyPage() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [category, setCategory] = useState(COMPLAINT_CATEGORIES[0])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('standard')
  const [incidentDate, setIncidentDate] = useState('')
  const [location, setLocation] = useState('')
  const [department, setDepartment] = useState(DEPARTMENTS[0])
  const [contactPreference, setContactPreference] = useState('portal')
  const [consent, setConsent] = useState(true)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Please provide a brief title for your complaint.')
      return
    }

    if (!description.trim() || description.trim().length < 15) {
      setError('Please provide a detailed description (at least 15 characters).')
      return
    }

    if (!consent) {
      setError('Please confirm the confidentiality & accuracy declaration.')
      return
    }

    setSubmitting(true)
    try {
      let geoData: {
        isEmergency?: boolean
        latitude?: number
        longitude?: number
        locationAccuracy?: number
        locationTimestamp?: string
        locationStatus?: string
      } = {}

      if (priority === 'critical') {
        const loc = await getDeviceLocation()
        geoData = {
          isEmergency: true,
          latitude: loc.latitude,
          longitude: loc.longitude,
          locationAccuracy: loc.accuracy,
          locationTimestamp: loc.timestamp || new Date().toISOString(),
          locationStatus: loc.locationStatus,
        }
      }

      // The Java backend automatically binds currentUser.getId() as owner.
      // We do NOT send untrusted client userId.
      const payload = {
        title: title.trim(),
        category,
        incidentCategory: category,
        description: description.trim(),
        narrative: description.trim(),
        priority: priority === 'critical' ? 'Critical' : (priority === 'urgent' ? 'High' : 'Moderate'),
        department,
        channel: contactPreference,
        location: location.trim(),
        language: 'en',
        ...geoData,
      }

      const created = await caseService.createCase(payload)
      showToast(`Complaint filed successfully! Case ID: ${created.caseNumber || created.id}`)
      navigate('/profile')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register complaint. Please try again.'
      setError(msg)
      showToast(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-enter mx-auto max-w-4xl px-4 py-8 lg:px-8 space-y-8">
      {/* Back link */}
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Link to="/profile">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile & Cases
          </Link>
        </Button>
      </div>

      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <Lock className="h-3.5 w-3.5" />
          Confidential & Authenticated Grievance Intake
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          File an Official Complaint
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Your complaint will be securely assigned a unique Case ID in MongoDB, bound to your authenticated citizen profile, and routed to the appropriate redressal authority for prompt review.
        </p>
      </div>

      {/* 1. Verified Citizen Identity Card */}
      <Card className="border-border/70 bg-surface/80 backdrop-blur-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Shield className="h-4 w-4 text-primary" />
            Authenticated Complainant Information
          </CardTitle>
          <CardDescription className="text-xs">
            The backend verifies and binds this complaint strictly to your authenticated session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 rounded-xl border border-border/70 bg-surface-muted/50 p-3.5 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Complainant Name</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                <User className="h-3.5 w-3.5 text-primary" />
                {user?.name || 'Citizen User'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Official Email</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5 truncate">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                {user?.email || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Contact Phone</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                <Phone className="h-3.5 w-3.5 text-primary" />
                {user?.phone || 'Not provided'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Citizen ID</span>
              <span className="font-mono font-semibold text-foreground mt-0.5 block truncate">
                {user?.id || 'SECURE-AUTH'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Complaint Application Form */}
      <Card className="border-border/80 shadow-[0_10px_30px_rgba(15,118,110,0.06)]">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Grievance Details
          </CardTitle>
          <CardDescription className="text-xs">
            Please fill in the incident particulars. All information is encrypted and accessible only to you and authorized case officers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category and Department */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5 text-sm font-medium">
                Complaint Category <span className="text-destructive">*</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full min-h-11 rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1.5 text-sm font-medium">
                Routed Department
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full min-h-11 rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            {/* Complaint Title */}
            <label className="block space-y-1.5 text-sm font-medium">
              Complaint Subject / Title <span className="text-destructive">*</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hostile workplace environment and harassment by supervisor"
                className="w-full min-h-11 rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </label>

            {/* Incident Date and Location */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5 text-sm font-medium">
                Incident Date (Approximate)
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full min-h-11 rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </label>

              <label className="block space-y-1.5 text-sm font-medium">
                Location / District / Workplace
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Pune Central, Hinjawadi Phase 1"
                    className="w-full min-h-11 rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </label>
            </div>

            {/* Detailed Statement */}
            <label className="block space-y-1.5 text-sm font-medium">
              Statement of Facts / Narrative <span className="text-destructive">*</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe what occurred in your own words. Include dates, circumstances, individuals involved (if safe to share), and the nature of assistance or safety intervention requested..."
                className="w-full rounded-xl border border-border bg-background p-3.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                required
              />
              <span className="text-[11px] text-muted-foreground block text-right">
                {description.length} characters (minimum 15 recommended)
              </span>
            </label>

            {/* Priority / Urgency */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Urgency & Priority Level
              </label>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { id: 'standard', label: 'Standard', desc: 'Routine redressal within 48h' },
                  { id: 'urgent', label: 'High Priority', desc: 'Urgent assessment within 24h' },
                  { id: 'critical', label: 'Critical / Danger', desc: 'Immediate emergency routing' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setPriority(tier.id)}
                    className={cn(
                      'rounded-xl border p-3 text-left transition',
                      priority === tier.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-surface hover:bg-surface-muted',
                    )}
                  >
                    <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                      {tier.label}
                      {priority === tier.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{tier.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Communication */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">
                Preferred Follow-up Method
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'portal', label: 'In-App Secure Portal Updates' },
                  { id: 'phone', label: 'Direct Phone Follow-up' },
                  { id: 'email', label: 'Confidential Email' },
                ].map((pref) => (
                  <label key={pref.id} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="contactPreference"
                      value={pref.id}
                      checked={contactPreference === pref.id}
                      onChange={() => setContactPreference(pref.id)}
                      className="accent-primary"
                    />
                    {pref.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="rounded-xl border border-border/80 bg-surface-muted/60 p-3.5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-primary cursor-pointer"
                  required
                />
                <span className="text-xs leading-relaxed text-muted-foreground">
                  I solemnly declare that the facts set forth in this complaint are true and accurate to the best of my knowledge. I authorize the designated case officer to review this confidential matter in accordance with the Sahayak AI privacy policy.
                </span>
              </label>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive flex items-center gap-2" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-xl">
                <Link to="/profile">Cancel</Link>
              </Button>

              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="w-full sm:w-auto min-w-[200px] rounded-xl font-semibold gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Recording in MongoDB...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
