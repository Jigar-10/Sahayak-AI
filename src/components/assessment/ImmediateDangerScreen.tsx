import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmergencyDialog } from '@/components/emergency/EmergencyDialog'

interface ImmediateDangerScreenProps {
  onContinue: () => void
  onExit: () => void
}

export function ImmediateDangerScreen({ onContinue, onExit }: ImmediateDangerScreenProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-critical/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-critical">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            Your Safety May Require Immediate Human Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You indicated that you may be in immediate danger. Your wellbeing comes first. Please
            consider reaching out for emergency support before continuing the assessment.
          </p>
          <EmergencyDialog
            trigger={
              <Button variant="destructive" className="w-full sm:w-auto">
                View Emergency Options
              </Button>
            }
          />
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={onContinue} variant="outline">
              Continue Assessment When Safe
            </Button>
            <Button onClick={onExit} variant="ghost">
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
