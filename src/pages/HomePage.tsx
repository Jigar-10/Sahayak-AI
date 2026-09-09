import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Heart, Phone, Sparkles, Timer, FilePlus, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmergencyDialog } from '@/components/emergency/EmergencyDialog'

const steps = [
  { step: '01', title: 'Sign In / Register', description: 'Authenticate securely so your complaint and identity remain strictly confidential.' },
  { step: '02', title: 'File Application', description: 'Share incident particulars, location, and relief requested in a safe environment.' },
  { step: '03', title: 'Automated Routing', description: 'Case is recorded in MongoDB, assigned a unique Case ID, and routed to officers.' },
  { step: '04', title: 'Track Progress', description: 'Monitor live milestone updates from review to investigation and resolution.' },
]

export function HomePage() {

  return (
    <div className="animate-enter hero-gradient">
      <section className="surface-grid overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Confidential Support & Formal Redressal
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
              A calmer way to find the <span className="text-primary">right support.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              A calm, trauma-informed space to share what happened, file official complaints, and track safety interventions — without pressure, judgement, or guesswork.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl font-semibold gap-2 shadow-sm">
                <Link to="/apply">
                  <FilePlus className="h-4 w-4" />
                  Apply / File a Complaint
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <Link to="/consent">Take Safe Screener</Link>
              </Button>

              <EmergencyDialog
                trigger={
                  <Button variant="secondary" size="lg" className="rounded-xl">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Emergency help
                  </Button>
                }
              />
            </div>

            <ul className="mt-6 grid gap-2 text-sm font-medium text-foreground sm:grid-cols-2">
              {[
                'Strict authentication before filing',
                'Protected citizen data isolation',
                'Live MongoDB milestone tracking',
                'Trauma-informed confidential support',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:ml-auto">
            <div className="absolute -inset-5 rounded-[2rem] bg-primary/10 blur-2xl" aria-hidden="true" />
            <Card className="relative overflow-hidden border-primary/10 bg-surface/90 p-1 shadow-[0_24px_70px_rgba(15,118,110,0.16)]">
              <div className="rounded-[0.9rem] bg-gradient-to-br from-primary to-[#123c43] p-7 text-white">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-white/15 p-3">
                    <Heart className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                    Private & Secure
                  </span>
                </div>
                <p className="mt-14 text-sm text-indigo-100">Official Grievance Redressal</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  You don’t have to figure it out alone.
                </p>
                <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-5 text-sm text-indigo-100">
                  <Timer className="h-4 w-4" aria-hidden="true" />
                  Fast response within 24–48 hours
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-8 max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">A clear path from application to resolution.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <Card key={item.step}>
              <CardContent className="p-6">
                <span className="font-mono text-sm font-bold text-primary">{item.step}</span>
                <h3 className="mt-8 text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Heart,
              title: 'Trauma-informed Care',
              text: 'Designed with sensitivity to distress. You retain full control over what you share.',
            },
            {
              icon: Shield,
              title: 'Strict Data Isolation',
              text: 'Every case record is encrypted and accessible only to you and authorized case caseworkers.',
            },
            {
              icon: Phone,
              title: 'Human Review & Action',
              text: 'Assigned officers review submissions, coordinate safety plans, and post real-time updates.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <Card key={title} className="bg-surface/70">
              <CardContent className="flex gap-4 p-6">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
