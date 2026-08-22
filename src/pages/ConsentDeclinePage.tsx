import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmergencyDialog } from '@/components/emergency/EmergencyDialog'

export function ConsentDeclinePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">You Can Still Access Support</h1>
      <p className="text-muted-foreground mb-8">
        We respect your decision not to use the AI-assisted assessment. Support services remain
        available to you through other channels.
      </p>
      <Card className="mb-8 text-left">
        <CardContent className="pt-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            You may browse available support resources, speak with a counsellor directly, or use
            emergency options if you feel unsafe.
          </p>
          <p className="text-sm text-muted-foreground">
            You can return to the assessment at any time if you change your mind.
          </p>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg">
          <Link to="/support">Browse Support Resources</Link>
        </Button>
        <EmergencyDialog
          trigger={<Button variant="destructive" size="lg">Emergency Help</Button>}
        />
        <Button asChild variant="outline" size="lg">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
