import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, HelpCircle, Shield, LogOut, User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmergencyButton } from '@/components/emergency/EmergencyDialog'
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls'
import { useAuthStore } from '@/store/authStore'
import { ChatBox } from '@/components/chat'
import { cn } from '@/lib/utils'

const publicNavItems = [
  { to: '/', label: 'Home' },
  { to: '/consent', label: 'Assessment' },
  { to: '/emergency', label: 'Emergency & Support' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isOwner = useAuthStore((state) => state.isOwner)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const navItems = [...publicNavItems]
  navItems.push({ to: '/apply', label: 'Apply / File Complaint' })
  if (isAuthenticated) {
    navItems.push({ to: '/profile', label: 'My Cases & Profile' })
    if (isOwner) {
      navItems.push({ to: '/dashboard', label: 'Dashboard' })
      navItems.push({ to: '/cases', label: 'Case Queue' })
    }
  }

  const handleLogout = async () => {
    await logout()
    setMobileOpen(false)
    navigate('/login')
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
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="min-h-10 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Sign out
            </Button>
          ) : (
            <Button asChild size="sm" variant="default" className="min-h-10 text-xs font-semibold rounded-xl">
              <Link to="/login">
                <LogIn className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Sign In
              </Link>
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated && (
            <Link
              to="/profile"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition"
              title="Open profile"
            >
              <User className="h-3.5 w-3.5" />
              <span className="max-w-[120px] truncate">{user?.name ? user.name.split(' ')[0] : 'Profile'}</span>
            </Link>
          )}
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
            {isAuthenticated ? (
              <li>
                <button type="button" onClick={handleLogout} className="block w-full rounded-md px-3 py-3 text-left text-sm font-medium min-h-11 text-destructive">
                  Sign out
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full rounded-md px-3 py-3 text-center text-sm font-semibold min-h-11 bg-primary text-primary-foreground">
                  Sign In
                </Link>
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
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatBox />
    </div>
  )
}
