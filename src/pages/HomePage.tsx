import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Shield, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmergencyDialog } from '@/components/emergency/EmergencyDialog'

const steps = [
  { step: 1, title: 'Consent', description: 'Review what is collected and give voluntary consent.' },
  { step: 2, title: 'Interaction', description: 'Share your experience in your own words, at your pace.' },
  { step: 3, title: 'AI-Assisted Analysis', description: 'Indicators are reviewed to suggest support options.' },
  { step: 4, title: 'Support Recommendation', description: 'Receive tailored resources and escalation options.' },
]

export function HomePage() {
  return (
    <div className="hero-gradient">
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary mb-3">
            National Helpline Against Atrocities · 14566
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Trauma-Informed Support Starts with Listening
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            A safe, confidential space to share your experience and receive guidance on
            available support services. This screening tool identifies indicators that may
            require additional support — it is not a medical diagnosis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button asChild size="lg">
              <Link to="/consent">
                Start Safe Assessment
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#how-it-works">Learn How It Works</a>
            </Button>
            <EmergencyDialog
              trigger={
                <Button variant="secondary" size="lg">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Emergency Help
                </Button>
              }
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your responses are handled with care. Read our consent information before starting.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <Card key={item.step}>
              <CardContent className="pt-6">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold mb-3"
                  aria-hidden="true"
                >
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 flex gap-3">
              <Heart className="h-8 w-8 text-accent shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-semibold mb-1">Trauma-Informed</h3>
                <p className="text-sm text-muted-foreground">
                  Designed with sensitivity to distress. You control what you share.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex gap-3">
              <Shield className="h-8 w-8 text-primary shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-semibold mb-1">Confidential Screening</h3>
                <p className="text-sm text-muted-foreground">
                  AI-assisted indicators help route you to appropriate support.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex gap-3">
              <Phone className="h-8 w-8 text-primary shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-semibold mb-1">Human Escalation</h3>
                <p className="text-sm text-muted-foreground">
                  Critical cases can be escalated for immediate human review.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
