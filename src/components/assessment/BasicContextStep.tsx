import {
  INCIDENT_CATEGORIES,
  SUPPORTED_LANGUAGES,
} from '@/constants/incidentCategories'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { AssessmentContext } from '@/types'

interface BasicContextStepProps {
  context: AssessmentContext
  onChange: (context: Partial<AssessmentContext>) => void
  onNext: () => void
}

export function BasicContextStep({ context, onChange, onNext }: BasicContextStepProps) {
  const canContinue = context.incidentCategory !== ''

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Basic Context</h2>
        <p className="text-sm text-muted-foreground">
          Share only what you are comfortable with. This helps us understand your situation.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Preferred Language</Label>
        <Select
          value={context.preferredLanguage}
          onValueChange={(value) => onChange({ preferredLanguage: value })}
        >
          <SelectTrigger id="language" aria-label="Preferred language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem
                key={lang.value}
                value={lang.value}
                disabled={lang.value !== 'en'}
              >
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Incident Category</Label>
        <Select
          value={context.incidentCategory}
          onValueChange={(value) => onChange({ incidentCategory: value })}
        >
          <SelectTrigger id="category" aria-label="Incident category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {INCIDENT_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
        <div>
          <Label htmlFor="immediate-danger" className="text-base">
            Are you in immediate danger right now?
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            If yes, we will show safety options before continuing.
          </p>
        </div>
        <Switch
          id="immediate-danger"
          checked={context.immediateDanger}
          onCheckedChange={(checked) => onChange({ immediateDanger: checked })}
          aria-label="Immediate danger toggle"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="safe-time">Safe time to contact (optional)</Label>
        <input
          id="safe-time"
          type="text"
          value={context.safeTime ?? ''}
          onChange={(e) => onChange({ safeTime: e.target.value })}
          placeholder="e.g., Weekdays after 6 PM"
          className="flex h-11 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="safe-contact">Safe contact method (optional)</Label>
        <input
          id="safe-contact"
          type="text"
          value={context.safeContact ?? ''}
          onChange={(e) => onChange({ safeContact: e.target.value })}
          placeholder="e.g., Email or phone you can safely receive calls on"
          className="flex h-11 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button onClick={onNext} disabled={!canContinue} size="lg">
        Continue
      </Button>
    </div>
  )
}
