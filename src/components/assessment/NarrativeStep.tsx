import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { FileText, Mic } from 'lucide-react'

interface NarrativeStepProps {
  narrative: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

export function NarrativeStep({ narrative, onChange, onNext, onBack }: NarrativeStepProps) {
  const canContinue = narrative.trim().length >= 20

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Tell Us What Happened</h2>
        <p className="text-sm text-muted-foreground">
          Share your experience in your own words, at your own pace. There is no character limit
          or time pressure.
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-medium mb-3">Choose interaction method</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg border-2 border-primary bg-primary/5 p-4',
            )}
            aria-current="true"
          >
            <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <p className="font-medium text-sm">Text</p>
              <p className="text-xs text-muted-foreground">Type your narrative</p>
            </div>
          </div>
          <div
            className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted p-4 opacity-60"
            aria-disabled="true"
          >
            <Mic className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="font-medium text-sm text-muted-foreground">Voice</p>
              <p className="text-xs text-muted-foreground">Available in Phase 2</p>
            </div>
          </div>
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="narrative">Your narrative</Label>
        <textarea
          id="narrative"
          value={narrative}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          placeholder="Tell us what happened in your own words..."
          className="flex w-full rounded-md border border-border bg-surface px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[200px]"
          aria-describedby="narrative-hint"
        />
        <p id="narrative-hint" className="text-xs text-muted-foreground">
          Your text is saved automatically as you type.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onNext} disabled={!canContinue} size="lg">
          Submit for Analysis
        </Button>
        <Button onClick={onBack} variant="outline" size="lg">
          Back
        </Button>
      </div>
    </div>
  )
}
