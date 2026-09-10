import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  HeartHandshake,
  HeartPulse,
  MonitorSmartphone,
  Phone,
  Scale,
  Shield,
  Siren,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { emergencyService, type BackendEmergencyNumber } from '@/services/emergencyService'
import { emergencyLocationService, getDeviceLocation } from '@/services/emergencyLocationService'

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

interface EmergencyDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EmergencyDialog({ trigger, open, onOpenChange }: EmergencyDialogProps) {
  const [contacts, setContacts] = useState<BackendEmergencyNumber[]>([])
  const [sosLoading, setSosLoading] = useState(false)
  const [sosResult, setSosResult] = useState<{
    caseId: string
    latitude?: number
    longitude?: number
    accuracy?: number
    locationStatus: string
    timestamp: string
  } | null>(null)
  const [sosError, setSosError] = useState<string | null>(null)

  useEffect(() => {
    emergencyService
      .getEmergencyNumbers()
      .then((data) => setContacts(data))
      .catch(() => {
        // Fallback default numbers if offline
        setContacts([
          {
            id: '112',
            name: 'Emergency Response Support System',
            number: '112',
            description: 'Police, fire, medical and urgent emergency response across India.',
            category: 'Emergency',
            isPrimary: true,
            iconName: 'Siren',
            available24x7: true,
            active: true,
          },
          {
            id: '181',
            name: 'Women Helpline',
            number: '181',
            description: 'Support and referrals for women experiencing violence, distress or harassment.',
            category: 'Women & Child Support',
            isPrimary: false,
            iconName: 'HeartHandshake',
            available24x7: true,
            active: true,
          },
        ])
      })
  }, [])

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
        notes: 'Emergency SOS initiated via quick emergency dialog.',
      }

      const created = await emergencyLocationService.triggerEmergency(payload)
      setSosResult({
        caseId: created.caseNumber || created.id,
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy,
        locationStatus: loc.locationStatus,
        timestamp: new Date().toLocaleTimeString(),
      })

      if (!loc.success) {
        setSosError(loc.errorMessage || 'Emergency recorded, but device GPS was unavailable.')
      }
    } catch (err: unknown) {
      setSosError(err instanceof Error ? err.message : 'Unable to broadcast SOS signal.')
    } finally {
      setSosLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent aria-describedby="emergency-dialog-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8">
            <AlertTriangle className="h-5 w-5 text-critical" aria-hidden="true" />
            Emergency &amp; Support
          </DialogTitle>
          <DialogDescription id="emergency-dialog-description">
            If you are in immediate danger, contact emergency services or transmit your live GPS location now.
          </DialogDescription>
        </DialogHeader>

        {/* Real-time Location SOS Trigger Banner */}
        <div className="rounded-xl border-2 border-red-500/40 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent p-4 text-left shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <h4 className="text-sm font-bold text-red-600 dark:text-red-400">
                  Instant SOS Location Dispatch
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Transmits your device's live coordinates directly to emergency responders and police cell.
              </p>
            </div>
          </div>

          {sosResult ? (
            <div className="mt-3 rounded-lg bg-background/90 p-3 border border-red-500/30 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-emerald-600 dark:text-emerald-400">
                <span>✓ Emergency Alert Active</span>
                <span className="font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {sosResult.caseId}
                </span>
              </div>
              {sosResult.latitude && sosResult.longitude ? (
                <div className="text-muted-foreground text-[11px] space-y-0.5">
                  <p>📍 GPS Coordinates: <span className="font-mono font-medium text-foreground">{sosResult.latitude.toFixed(5)}, {sosResult.longitude.toFixed(5)}</span> {sosResult.accuracy && `(±${sosResult.accuracy}m)`}</p>
                  <p>⏱ Transmitted at {sosResult.timestamp}</p>
                </div>
              ) : (
                <p className="text-amber-600 dark:text-amber-400 text-[11px]">
                  ⚠️ Alert logged. GPS permission was unavailable.
                </p>
              )}
              {sosError && <p className="text-amber-600 dark:text-amber-400 text-[11px]">{sosError}</p>}
            </div>
          ) : (
            <div className="mt-3">
              <Button
                type="button"
                onClick={handleTriggerSos}
                disabled={sosLoading}
                className="w-full min-h-10 bg-red-600 hover:bg-red-700 text-white font-bold text-xs gap-2 rounded-lg shadow-md shadow-red-500/20"
              >
                {sosLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Acquiring Device GPS Fix &amp; Alerting Responders...
                  </>
                ) : (
                  <>
                    <Siren className="h-4 w-4" />
                    Transmit Live Location &amp; Trigger SOS
                  </>
                )}
              </Button>
              {sosError && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">{sosError}</p>
              )}
            </div>
          )}
        </div>

        <ul className="space-y-3" role="list">
          {contacts.slice(0, 3).map((contact) => {
            const Icon = ICON_MAP[contact.iconName] || Phone

            return (
              <li
                key={contact.id}
                className={
                  contact.isPrimary
                    ? 'rounded-lg border-2 border-critical/30 bg-critical/5 p-4'
                    : 'rounded-lg border border-border bg-surface-muted p-4'
                }
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className={
                      contact.isPrimary
                        ? 'mt-0.5 h-5 w-5 shrink-0 text-critical'
                        : 'mt-0.5 h-5 w-5 shrink-0 text-primary'
                    }
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{contact.description}</p>
                    <a
                      href={`tel:${contact.number}`}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Call ${contact.name} at ${contact.number}`}
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      Call {contact.number}
                    </a>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <Link
          to="/emergency"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          View all emergency and support numbers
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </DialogContent>
    </Dialog>
  )
}

export function EmergencyButton({ className }: { className?: string }) {
  return (
    <EmergencyDialog
      trigger={
        <Button
          variant="destructive"
          size="sm"
          className={className}
          aria-label="Open emergency support options"
        >
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Emergency</span>
        </Button>
      }
    />
  )
}
