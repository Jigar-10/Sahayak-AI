import { Link } from 'react-router-dom'
import { ArrowLeft, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { emergencyNumbers } from '@/data/emergencyNumbers'

const categoryOrder = ['Emergency', 'Women & Child Support', 'SC/ST Support', 'Cyber Crime'] as const

export function EmergencyPage() {
  const primary = emergencyNumbers.find((contact) => contact.isPrimary)
  const otherNumbers = emergencyNumbers.filter((contact) => !contact.isPrimary)
  return <div className="animate-enter mx-auto max-w-7xl px-4 py-12 lg:px-8">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="mb-2 text-sm font-medium text-primary">Quick, official helpline information</p><h1 className="text-3xl font-bold md:text-4xl">Emergency &amp; Support</h1><p className="mt-2 max-w-2xl text-muted-foreground">If you are in immediate danger, contact emergency services now.</p></div><Button variant="secondary" asChild><Link to="/support"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to Support</Link></Button></div>
    {primary && <Card className="mb-8 border-2 border-critical/30 bg-critical/5"><CardHeader><CardTitle className="text-xl">{primary.number} — Emergency Response</CardTitle><CardDescription>{primary.description}</CardDescription></CardHeader><CardContent><a href={`tel:${primary.number}`} className="inline-flex min-h-12 items-center gap-2 rounded-md bg-critical px-6 py-3 text-base font-semibold text-white hover:bg-critical/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Call emergency services at ${primary.number}`}><Phone className="h-5 w-5" aria-hidden="true" />Call {primary.number}</a><p className="mt-3 text-sm text-muted-foreground">{primary.availability}</p></CardContent></Card>}
    <div className="space-y-8">{categoryOrder.map((category) => { const contacts = otherNumbers.filter((contact) => contact.category === category); if (!contacts.length) return null; return <section key={category} aria-labelledby={`${category}-heading`}><h2 id={`${category}-heading`} className="mb-3 text-xl font-semibold">{category}</h2><div className="grid gap-4 md:grid-cols-2">{contacts.map((contact) => { const Icon = contact.icon; return <Card key={contact.id} className="flex flex-col"><CardHeader><CardTitle className="flex items-start gap-3 text-lg"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span>{contact.name}</span></CardTitle><CardDescription className="pl-8">{contact.description}</CardDescription></CardHeader><CardContent className="mt-auto flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono text-xl font-semibold">{contact.number}</p>{contact.availability && <p className="mt-1 max-w-xs text-xs text-muted-foreground">{contact.availability}</p>}</div><a href={`tel:${contact.number}`} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Call ${contact.name} at ${contact.number}`}><Phone className="h-4 w-4" aria-hidden="true" />Call {contact.number}</a></CardContent></Card> })}</div></section> })}</div>
    <p className="mt-10 text-sm text-muted-foreground">These numbers connect to external services. Sahayak AI does not collect call details, contacts or call history.</p>
  </div>
}
