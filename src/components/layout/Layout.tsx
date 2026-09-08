import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, HelpCircle, Shield, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmergencyButton } from '@/components/emergency/EmergencyDialog'
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

const publicNavItems = [
  { to: '/', label: 'Home' },
  { to: '/consent', label: 'Assessment' },
  { to: '/support', label: 'Support' },
  { to: '/emergency', label: 'Emergency & Support' },
]

const ownerNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/cases', label: 'Cases' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isOwner = useAuthStore((state) => state.isOwner)
  const logoutOwner = useAuthStore((state) => state.logoutOwner)
  const navItems = isOwner ? [...publicNavItems, ...ownerNavItems] : publicNavItems

  const handleLogout = () => {
    logoutOwner()
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(79,70,229,0.24)]" aria-hidden="true">
            <Shield className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-foreground leading-tight">Sahayak <span className="text-primary">AI</span></p>
            <p className="truncate text-[11px] font-medium text-muted-foreground">Safe support, one step at a time</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-border/70 bg-surface-muted/70 p-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'rounded-xl px-3 py-2 text-sm font-semibold transition-all min-h-10 flex items-center',
                isActive ? 'bg-surface text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-surface',
              )}
            >
              {item.label}
            </NavLink>
          ))}
          {isOwner && (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="min-h-11">
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" aria-label="Help and information" className="hidden sm:inline-flex"><HelpCircle className="h-5 w-5" aria-hidden="true" /></Button>
          <AccessibilityControls />
          <EmergencyButton />
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-controls="mobile-nav" aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-nav" className="border-t border-border bg-surface px-4 py-3 md:hidden" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => cn('block rounded-md px-3 py-3 text-sm font-medium min-h-11', isActive ? 'bg-primary/10 text-primary' : 'text-foreground')}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            {isOwner && (
              <li>
                <button type="button" onClick={handleLogout} className="block w-full rounded-md px-3 py-3 text-left text-sm font-medium min-h-11 text-foreground">
                  Sign out
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-surface/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-center text-sm text-muted-foreground lg:px-8">
        <p className="font-medium text-foreground/75">Sahayak AI · trauma-informed support for safer next steps.</p>
        <p className="text-xs">Prototype built for Smart India Hackathon 2026. Not an official government service. For immediate danger, call 112.</p>
      </div>
    </footer>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col"><Header /><main className="flex-1">{children}</main><Footer /></div>
}
