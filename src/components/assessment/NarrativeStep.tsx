import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { VoiceRecorder } from '@/components/assessment/VoiceRecorder'
import { cn } from '@/lib/utils'
import { FileText, Mic } from 'lucide-react'
import type { InteractionChannel } from '@/types'

interface NarrativeStepProps {
  narrative: string
  channel: InteractionChannel
  onChannelChange: (channel: InteractionChannel) => void
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

export function NarrativeStep({
  narrative,
  channel,
  onChannelChange,
  onChange,
  onNext,
  onBack,
}: NarrativeStepProps) {
  const canContinue = channel === 'voice' || narrative.trim().length >= 20

  const handleVoiceReady = (transcript: string) => {
    onChange(transcript)
    onNext()
  }

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
          <button
            type="button"
            onClick={() => onChannelChange('text')}
            className={cn(
              'flex min-h-20 items-center gap-3 rounded-lg border p-4 text-left transition-colors',
              channel === 'text'
                ? 'border-2 border-primary bg-primary/5'
                : 'border-border bg-surface hover:bg-surface-muted',
            )}
            aria-pressed={channel === 'text'}
          >
            <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <p className="font-medium text-sm">Text</p>
              <p className="text-xs text-muted-foreground">Type your narrative</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onChannelChange('voice')}
            className={cn(
              'flex min-h-20 items-center gap-3 rounded-lg border p-4 text-left transition-colors',
              channel === 'voice'
                ? 'border-2 border-primary bg-primary/5'
                : 'border-border bg-surface hover:bg-surface-muted',
            )}
            aria-pressed={channel === 'voice'}
          >
            <Mic className="h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <p className="font-medium text-sm">Voice</p>
              <p className="text-xs text-muted-foreground">Record your narrative</p>
            </div>
          </button>
        </div>
      </fieldset>

      {channel === 'text' ? (
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
      ) : (
        <VoiceRecorder
          onTranscriptReady={handleVoiceReady}
          onUseText={() => onChannelChange('text')}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {channel === 'text' && (
          <Button onClick={onNext} disabled={!canContinue} size="lg">
            Submit for Analysis
          </Button>
        )}
        <Button onClick={onBack} variant="outline" size="lg">
          Back
        </Button>
      </div>
    </div>
  )
}
