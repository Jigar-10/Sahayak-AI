import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  Baby,
  HeartHandshake,
  HeartPulse,
  Loader2,
  MonitorSmartphone,
  Phone,
  Scale,
  Shield,
  Siren,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { emergencyService, type BackendEmergencyNumber } from '@/services/emergencyService'
import { emergencyLocationService, getDeviceLocation } from '@/services/emergencyLocationService'
import { MapPin, Navigation, CheckCircle2 } from 'lucide-react'

const ICON_MAP: Record<string, typeof Phone> = {
  Siren,
  HeartPulse,
  HeartHandshake,
  Shield,
  Baby,
  Scale,
  MonitorSmartphone,
  Phone,
}

const categoryOrder = ['Emergency', 'Women & Child Support', 'SC/ST Support', 'Cyber Crime'] as const

export function EmergencyPage() {
  const [numbers, setNumbers] = useState<BackendEmergencyNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // SOS Location Transmission State
  const [sosLoading, setSosLoading] = useState(false)
  const [sosSuccess, setSosSuccess] = useState<{
    caseId: string
    latitude?: number
    longitude?: number
    accuracy?: number
    timestamp: string
    locationStatus: string
  } | null>(null)
  const [sosError, setSosError] = useState<string | null>(null)

  const handleTriggerSos = async () => {
    setSosLoading(true)
    setSosError(null)
    try {
      const loc = await getDeviceLocation()
      const payload = {
        emergencyType: 'SOS_PANIC',
        latitude: loc.latitude,
        longitude: loc.longitude,
        locationAccuracy: loc.accuracy,
        locationTimestamp: loc.timestamp || new Date().toISOString(),
        locationStatus: loc.locationStatus,
        notes: 'Emergency SOS triggered from dedicated Emergency Page.',
      }

      const created = await emergencyLocationService.triggerEmergency(payload)
      setSosSuccess({
        caseId: created.caseNumber || created.id,
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy,
        timestamp: new Date().toLocaleTimeString(),
        locationStatus: loc.locationStatus,
      })

      if (!loc.success) {
        setSosError(loc.errorMessage || 'Emergency alert logged, but GPS signal was unavailable.')
      }
    } catch (err: unknown) {
      setSosError(err instanceof Error ? err.message : 'Failed to broadcast emergency SOS.')
    } finally {
      setSosLoading(false)
    }
  }

  const loadNumbers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await emergencyService.getEmergencyNumbers()
      setNumbers(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load emergency numbers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNumbers()
  }, [])

  const primary = numbers.find((contact) => contact.isPrimary)
  const otherNumbers = numbers.filter((contact) => !contact.isPrimary)

  return (
    <div className="animate-enter mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">Quick, official helpline information</p>
          <h1 className="text-3xl font-bold md:text-4xl">Emergency &amp; Support</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            If you are in immediate danger, contact emergency services now.
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link to="/support">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Support
          </Link>
        </Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm">Loading verified emergency helplines...</p>
        </div>
      )}

      {error && !loading && (
        <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={loadNumbers}>
            Retry
          </Button>
        </div>
      )}

      {!loading && numbers.length === 0 && !error && (
        <div className="rounded-2xl border border-border p-12 text-center text-muted-foreground">
          <Phone className="mx-auto h-8 w-8 opacity-40" />
          <p className="mt-2 font-medium">No emergency numbers found.</p>
        </div>
      )}

      {/* Instant Emergency SOS with Device GPS Dispatch */}
      <Card className="mb-8 border-2 border-red-500/50 bg-gradient-to-r from-red-950/20 via-rose-900/10 to-transparent shadow-lg shadow-red-500/5 overflow-hidden">
        <div className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="font-bold text-xs uppercase tracking-wider text-red-500">
                Instant Response Network
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Emergency Case → Automatic Live Location Sharing
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              If you are facing immediate physical harm or distress, triggering this SOS captures your real-time device coordinates and transmits them immediately to police and emergency responders for dispatch.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col items-stretch md:items-end gap-2">
            <Button
              type="button"
              onClick={handleTriggerSos}
              disabled={sosLoading}
              size="lg"
              className="min-h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 rounded-xl shadow-lg shadow-red-600/30 gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {sosLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Acquiring GPS Fix &amp; Broadcasting SOS...
                </>
              ) : (
                <>
                  <Siren className="h-5 w-5" />
                  Trigger Emergency SOS with Live Location
                </>
              )}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center md:text-right">
              Uses device GPS • Encrypted &amp; restricted to official responders
            </p>
          </div>
        </div>

        {sosSuccess && (
          <div className="border-t border-red-500/30 bg-emerald-500/10 p-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Emergency Distress Alert Logged (Case ID: <span className="font-mono">{sosSuccess.caseId}</span>)</span>
              </div>
              {sosSuccess.latitude && sosSuccess.longitude ? (
                <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                  <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  <span>GPS: <span className="font-mono font-medium text-foreground">{sosSuccess.latitude.toFixed(5)}, {sosSuccess.longitude.toFixed(5)}</span> {sosSuccess.accuracy && `(±${sosSuccess.accuracy}m)`}</span>
                  <span>• Sent at {sosSuccess.timestamp}</span>
                </div>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 text-[11px]">
                  Alert logged without device GPS coordinates.
                </span>
              )}
            </div>
            {sosError && (
              <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">{sosError}</p>
            )}
          </div>
        )}
      </Card>

      {!loading && primary && (
        <Card className="mb-8 border-2 border-critical/30 bg-critical/5">
          <CardHeader>
            <CardTitle className="text-xl">{primary.number} — Emergency Response</CardTitle>
            <CardDescription>{primary.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href={`tel:${primary.number}`}
              className="inline-flex min-h-12 items-center gap-2 rounded-md bg-critical px-6 py-3 text-base font-semibold text-white hover:bg-critical/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Call emergency services at ${primary.number}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call {primary.number}
            </a>
            {primary.availability && (
              <p className="mt-3 text-sm text-muted-foreground">{primary.availability}</p>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && (
        <div className="space-y-8">
          {categoryOrder.map((category) => {
            const contacts = otherNumbers.filter((contact) => contact.category === category)
            if (!contacts.length) return null

            return (
              <section key={category} aria-labelledby={`${category}-heading`}>
                <h2 id={`${category}-heading`} className="mb-3 text-xl font-semibold">
                  {category}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {contacts.map((contact) => {
                    const Icon = ICON_MAP[contact.iconName] || Phone

                    return (
                      <Card key={contact.id} className="flex flex-col">
                        <CardHeader>
                          <CardTitle className="flex items-start gap-3 text-lg">
                            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                            <span>{contact.name}</span>
                          </CardTitle>
                          <CardDescription className="pl-8">{contact.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-mono text-xl font-semibold">{contact.number}</p>
                            {contact.availability && (
                              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                                {contact.availability}
                              </p>
                            )}
                          </div>
                          <a
                            href={`tel:${contact.number}`}
                            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Call ${contact.name} at ${contact.number}`}
                          >
                            <Phone className="h-4 w-4" aria-hidden="true" />
                            Call {contact.number}
                          </a>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <p className="mt-10 text-sm text-muted-foreground">
        These numbers connect to official external services. Sahayak AI does not collect call details,
        contacts or call history.
      </p>
    </div>
  )
}
