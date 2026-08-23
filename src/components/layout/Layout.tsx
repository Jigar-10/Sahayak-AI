import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, HelpCircle, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmergencyButton } from '@/components/emergency/EmergencyDialog'
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/consent', label: 'Assessment' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/cases', label: 'Cases' },
  { to: '/support', label: 'Support' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-primary leading-tight">
              National Helpline Against Atrocities
            </p>
            <p className="truncate text-xs text-muted-foreground">
              AI-Assisted Stress &amp; Trauma Assessment
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors min-h-11 flex items-center',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-muted',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" aria-label="Help and information">
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
          </Button>
          <AccessibilityControls />
          <EmergencyButton />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-surface px-4 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-3 py-3 text-sm font-medium min-h-11',
                      isActive ? 'bg-primary/10 text-primary' : 'text-foreground',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          Prototype built for Smart India Hackathon 2026. Not an official government service.
          All data shown is fictional.
        </p>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Helpline reference: 14566 (demonstration only)
        </p>
      </div>
    </footer>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
