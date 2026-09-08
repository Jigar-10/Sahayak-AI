import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, Phone } from 'lucide-react'
import { emergencyNumbers } from '@/data/emergencyNumbers'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface EmergencyDialogProps { trigger?: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }

export function EmergencyDialog({ trigger, open, onOpenChange }: EmergencyDialogProps) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
    <DialogContent aria-describedby="emergency-dialog-description">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 pr-8"><AlertTriangle className="h-5 w-5 text-critical" aria-hidden="true" />Emergency &amp; Support</DialogTitle>
        <DialogDescription id="emergency-dialog-description">If you are in immediate danger, contact emergency services now.</DialogDescription>
      </DialogHeader>
      <ul className="space-y-3" role="list">
        {emergencyNumbers.slice(0, 3).map((contact) => { const Icon = contact.icon; return <li key={contact.id} className={contact.isPrimary ? 'rounded-lg border-2 border-critical/30 bg-critical/5 p-4' : 'rounded-lg border border-border bg-surface-muted p-4'}>
          <div className="flex items-start gap-3"><Icon className={contact.isPrimary ? 'mt-0.5 h-5 w-5 shrink-0 text-critical' : 'mt-0.5 h-5 w-5 shrink-0 text-primary'} aria-hidden="true" /><div className="min-w-0 flex-1"><h3 className="font-medium">{contact.name}</h3><p className="mt-1 text-sm text-muted-foreground">{contact.description}</p><a href={`tel:${contact.number}`} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Call ${contact.name} at ${contact.number}`}><Phone className="h-4 w-4" aria-hidden="true" />Call {contact.number}</a></div></div>
        </li> })}
      </ul>
      <Link to="/emergency" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline">View all emergency and support numbers<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </DialogContent>
  </Dialog>
}

export function EmergencyButton({ className }: { className?: string }) { return <EmergencyDialog trigger={<Button variant="destructive" size="sm" className={className} aria-label="Open emergency support options"><AlertTriangle className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">Emergency</span></Button>} /> }
