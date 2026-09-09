import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export const OwnerProfilePage: React.FC = () => {
  const { user, updateProfile, logout, checkAuth } = useAuthStore()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
    }
  }, [user])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setSaving(true)
      setError(null)
      const success = await updateProfile(name.trim(), phone.trim() || undefined)
      if (success) {
        setFeedback('Official profile updated successfully.')
        await checkAuth()
        setTimeout(() => setFeedback(null), 4000)
      } else {
        setError('Failed to update profile details.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/owner/login', { replace: true })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
          Officer Credentials & Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your verified law enforcement / operational identity and active session parameters.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Identity Overview Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{user?.name || 'Case Officer'}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {user?.role || 'ROLE_OWNER'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Official Account</span>
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Session</span>
          </Button>
        </div>

        {/* Security Parameters Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-[11px] text-slate-400 block">System Role</span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {user?.role || 'ROLE_OWNER'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-[11px] text-slate-400 block">Status</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Active & Authorized
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-[11px] text-slate-400 block">Authentication Protocol</span>
            <span className="text-xs font-mono text-slate-300">JWT / BCrypt Salted</span>
          </div>
        </div>
      </div>

      {/* Edit Form Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-amber-400" />
          <span>Update Operational Profile Details</span>
        </h3>

        <form onSubmit={handleUpdate} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Official Officer Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full h-10 rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Official Contact Phone (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full h-10 rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5 opacity-70">
            <label className="block text-xs font-semibold text-slate-300">Official Email (Locked)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full h-10 rounded-xl bg-slate-800/50 border border-slate-700/60 pl-9 pr-3 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-500">Official email is permanently bound to your department authorization.</p>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={saving || !name.trim()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-6 shadow-lg shadow-amber-500/10"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
