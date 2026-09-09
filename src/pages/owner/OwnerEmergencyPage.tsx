import React, { useEffect, useState, useMemo } from 'react'
import { emergencyService, type BackendEmergencyNumber } from '@/services/emergencyService'
import {
  PhoneCall,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Phone,
  Star,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const OwnerEmergencyPage: React.FC = () => {
  const [numbers, setNumbers] = useState<BackendEmergencyNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form Fields
  const [formData, setFormData] = useState<Partial<BackendEmergencyNumber>>({
    name: '',
    number: '',
    description: '',
    category: 'Emergency',
    available24x7: true,
    active: true,
    isPrimary: false,
    iconName: 'Phone',
  })

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchNumbers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await emergencyService.getEmergencyNumbers()
      setNumbers(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch emergency directory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNumbers()
  }, [])

  const openAddModal = () => {
    setEditingId(null)
    setFormData({
      name: '',
      number: '',
      description: '',
      category: 'Emergency',
      available24x7: true,
      active: true,
      isPrimary: false,
      iconName: 'Phone',
    })
    setModalOpen(true)
  }

  const openEditModal = (item: BackendEmergencyNumber) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      number: item.number,
      description: item.description,
      category: item.category,
      available24x7: item.available24x7,
      active: item.active,
      isPrimary: item.isPrimary,
      iconName: item.iconName || 'Phone',
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name?.trim() || !formData.number?.trim()) return

    try {
      setSaving(true)
      if (editingId) {
        await emergencyService.update(editingId, formData)
        setFeedback('Helpline contact updated successfully.')
      } else {
        await emergencyService.create(formData)
        setFeedback('New emergency helpline successfully added to directory.')
      }
      setModalOpen(false)
      await fetchNumbers()
      setTimeout(() => setFeedback(null), 4000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save emergency contact.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this emergency contact?')) return

    try {
      setDeletingId(id)
      await emergencyService.delete(id)
      setFeedback('Helpline deleted from database.')
      await fetchNumbers()
      setTimeout(() => setFeedback(null), 4000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete emergency contact.')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredNumbers = useMemo(() => {
    return numbers.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const name = (item.name || '').toLowerCase()
        const num = (item.number || '').toLowerCase()
        const desc = (item.description || '').toLowerCase()
        return name.includes(q) || num.includes(q) || desc.includes(q)
      }
      return true
    })
  }, [numbers, searchQuery, categoryFilter])

  const categories = useMemo(() => {
    const set = new Set<string>()
    numbers.forEach((n) => {
      if (n.category) set.add(n.category)
    })
    return Array.from(set)
  }, [numbers])

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Emergency Helpline Directory
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium border border-slate-700">
              {numbers.length} contacts
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain public crisis helplines, rapid-response dispatch numbers, and specialized support lines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNumbers}
            disabled={loading}
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={openAddModal}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Add Helpline</span>
          </Button>
        </div>
      </div>

      {/* Feedback & Error */}
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

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by helpline name, dial code, or description..."
            className="w-full h-10 rounded-xl bg-slate-800/80 border border-slate-700 pl-9 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-xl bg-slate-800 border border-slate-700 px-3 text-xs text-slate-200 outline-none focus:border-amber-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Numbers Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
          <p className="text-sm text-slate-400">Loading helpline records...</p>
        </div>
      ) : filteredNumbers.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <PhoneCall className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No helplines match your query</h3>
          <p className="text-xs text-slate-500">
            {searchQuery ? 'Try another keyword or reset the category filter.' : 'No emergency contacts registered.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNumbers.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4 shadow-lg group relative overflow-hidden"
            >
              {item.isPrimary && (
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-bl-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3 fill-slate-950" />
                  Primary
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600/20 to-yellow-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[11px] text-slate-400">{item.category}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-2xl font-black font-mono tracking-tight text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20 inline-block">
                    {item.number}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                  {item.description || 'Emergency support service line.'}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  {item.available24x7 && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      24/7 Service
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded font-medium border ${
                      item.active
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {item.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(item)}
                  className="border-slate-700 hover:bg-slate-800 text-slate-200 text-xs flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>{editingId ? 'Edit Emergency Contact' : 'Add New Emergency Helpline'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Helpline / Service Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. National Cyber Crime Helpline"
                  className="w-full h-10 rounded-xl bg-slate-800 border border-slate-700 px-3 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Dialing Number / Code</label>
                <input
                  type="text"
                  value={formData.number || ''}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="e.g. 1930"
                  className="w-full h-10 rounded-xl bg-slate-800 border border-slate-700 px-3 text-sm font-mono text-amber-400 placeholder:text-slate-500 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={formData.category || 'Emergency'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 rounded-xl bg-slate-800 border border-slate-700 px-3 text-xs text-slate-200 outline-none focus:border-amber-500"
                >
                  <option value="Emergency">Emergency</option>
                  <option value="Women & Child Support">Women & Child Support</option>
                  <option value="Cyber Crime">Cyber Crime</option>
                  <option value="SC/ST Support">SC/ST Support</option>
                  <option value="Mental Health Support">Mental Health Support</option>
                  <option value="Legal Aid">Legal Aid</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of service scope..."
                  rows={2}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.available24x7 ?? true}
                    onChange={(e) => setFormData({ ...formData, available24x7: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>24x7 Availability</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPrimary ?? false}
                    onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Mark as Primary</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active ?? true}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Active & Listed</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  className="border-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={saving || !formData.name?.trim() || !formData.number?.trim()}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                  {editingId ? 'Save Changes' : 'Create Contact'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
