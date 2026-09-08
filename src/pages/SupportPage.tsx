import { Link } from 'react-router-dom'
import { Heart, Scale, Stethoscope, Shield, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmergencyDialog } from '@/components/emergency/EmergencyDialog'

const resources = [
  {
    icon: Heart,
    title: 'Counselling Services',
    description: 'Trauma-informed emotional support from trained professionals.',
  },
  {
    icon: Scale,
    title: 'Legal Aid',
    description: 'Guidance on filing complaints and understanding your rights.',
  },
  {
    icon: Stethoscope,
    title: 'Medical Support',
    description: 'Physical and psychological health evaluation referrals.',
  },
  {
    icon: Shield,
    title: 'Protection Services',
    description: 'Safety planning and protective measure assistance.',
  },
]

export function SupportPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Support Resources</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Available support pathways. For a personalized recommendation, consider starting the
        safe assessment.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {resources.map((resource) => (
          <Card key={resource.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <resource.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                {resource.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{resource.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <Link to="/consent">Start Safe Assessment</Link>
        </Button>
        <EmergencyDialog
          trigger={
            <Button variant="destructive">
              <Phone className="h-4 w-4" aria-hidden="true" />
              Emergency Help
            </Button>
          }
        />
        <Button variant="secondary" asChild>
          <Link to="/emergency">View Emergency &amp; Support Numbers</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        Emergency numbers are provided for information and direct calling. In immediate danger, call 112.
      </p>
    </div>
  )
}
