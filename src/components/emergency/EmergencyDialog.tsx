import { EMERGENCY_CONTACTS } from '@/constants/emergencyContacts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Phone } from 'lucide-react'

interface EmergencyDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EmergencyDialog({ trigger, open, onOpenChange }: EmergencyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent aria-describedby="emergency-dialog-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-critical" aria-hidden="true" />
            Emergency Support Options
          </DialogTitle>
          <DialogDescription id="emergency-dialog-description">
            These are placeholder contacts for demonstration purposes only. In a live
            deployment, verified emergency numbers would appear here.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-3" role="list">
          {EMERGENCY_CONTACTS.map((contact) => (
            <li
              key={contact.id}
              className="rounded-lg border border-border p-4 bg-surface-muted"
            >
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-medium">{contact.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{contact.description}</p>
                  <p className="text-sm font-mono mt-2 text-muted-foreground">
                    {contact.contact}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Demonstration Data — not connected to real emergency services.
        </p>
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
