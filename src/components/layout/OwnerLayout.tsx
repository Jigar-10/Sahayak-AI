import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  PhoneCall,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'

export const OwnerLayout: React.FC = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/owner/login', { replace: true })
  }

  const navItems = [
    { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/owner/cases', label: 'Case Management', icon: FileText },
    { to: '/owner/emergency-numbers', label: 'Emergency Helplines', icon: PhoneCall },
    { to: '/owner/profile', label: 'Official Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Staff Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Portal Branding */}
            <div className="flex items-center gap-3">
              <Link to="/owner/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent">
                      Sahayak AI
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Officer Portal
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Command & Operations Console</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>

            {/* Right Side: Officer Status & Controls */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2.5 py-1.5 rounded-md hover:bg-slate-800/50"
                title="View Citizen Portal"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Public Portal</span>
              </Link>

              <div className="h-5 w-px bg-slate-800" />

              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-xs text-slate-950 shadow-sm shadow-amber-500/20">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">
                    {user?.name || 'Case Officer'}
                  </div>
                  <div className="text-[10px] font-mono text-amber-400 font-medium">
                    {user?.role || 'ROLE_OWNER'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all ml-1"
                title="Sign out of Officer Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-amber-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
            <div className="p-3 mb-2 rounded-lg bg-slate-800/70 border border-slate-700/50 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{user?.name || 'Case Officer'}</p>
                <p className="text-xs text-amber-400 font-mono">{user?.email}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                {user?.role}
              </span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </NavLink>
              )
            })}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white py-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit Citizen Portal</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Staff Portal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 text-slate-500 text-xs py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Sahayak AI Case Management System. Authorized Law Enforcement & NGO Staff Access Only.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Secure Session Active
            </span>
            <Link to="/" className="text-slate-400 hover:text-slate-200 transition-colors">
              Citizen Frontline
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
