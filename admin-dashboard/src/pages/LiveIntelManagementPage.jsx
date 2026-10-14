import React, { useState, useMemo } from 'react'
import {
  Radio,
  Search,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Filter,
} from 'lucide-react'
import { AdminModal } from '../components/common/AdminModal'

const PRESET_CATEGORIES = [
  'LIVE AUDIT',
  'GATEWAY UPDATE',
  'COST OF LIVING',
  'MANAGEMENT INTELLIGENCE',
  'CONSUMER ADVISORY',
  'ADMISSIONS OPEN',
  'PLACEMENT ALERT',
  'CUTOFF UPDATE',
]

const LiveIntelManagementPage = ({
  alerts = [],
  onAddAlert,
  onUpdateAlert,
  onToggleAlert,
  onDeleteAlert,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modals
  const [modalMode, setModalMode] = useState(null) // 'add' | 'edit' | null
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    category: 'LIVE AUDIT',
    customCategory: '',
    text: '',
    link: '',
    priority: 5,
    isActive: true,
  })

  const openAddModal = () => {
    setFormData({
      category: 'LIVE AUDIT',
      customCategory: '',
      text: '',
      link: '',
      priority: 5,
      isActive: true,
    })
    setModalMode('add')
  }

  const openEditModal = (alert) => {
    setSelectedAlert(alert)
    const isPreset = PRESET_CATEGORIES.includes(alert.category)
    setFormData({
      category: isPreset ? alert.category : 'CUSTOM',
      customCategory: isPreset ? '' : alert.category,
      text: alert.text || '',
      link: alert.link || '',
      priority: alert.priority || 0,
      isActive: alert.isActive !== undefined ? alert.isActive : true,
    })
    setModalMode('edit')
  }

  const handleSubmit = async () => {
    const finalCategory =
      formData.category === 'CUSTOM'
        ? (formData.customCategory || 'LIVE INTEL').trim().toUpperCase()
        : formData.category

    if (!formData.text.trim()) {
      alert('Please enter the alert text / headline.')
      return
    }

    setIsProcessing(true)
    try {
      const payload = {
        category: finalCategory,
        text: formData.text.trim(),
        link: formData.link.trim(),
        priority: Number(formData.priority) || 0,
        isActive: Boolean(formData.isActive),
      }

      if (modalMode === 'add') {
        if (onAddAlert) await onAddAlert(payload)
      } else if (modalMode === 'edit' && selectedAlert) {
        if (onUpdateAlert) await onUpdateAlert(selectedAlert.id || selectedAlert._id, payload)
      }
      setModalMode(null)
      setSelectedAlert(null)
    } catch (err) {
      alert(err.message || 'Operation failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedAlert) return
    setIsProcessing(true)
    try {
      if (onDeleteAlert) await onDeleteAlert(selectedAlert.id || selectedAlert._id)
      setDeleteModalOpen(false)
      setSelectedAlert(null)
    } catch (err) {
      alert(err.message || 'Failed to delete alert')
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchSearch =
        searchQuery === '' ||
        a.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory =
        categoryFilter === 'all' || a.category === categoryFilter

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && a.isActive) ||
        (statusFilter === 'paused' && !a.isActive)

      return matchSearch && matchCategory && matchStatus
    })
  }, [alerts, searchQuery, categoryFilter, statusFilter])

  const totalCount = alerts.length
  const activeCount = alerts.filter((a) => a.isActive).length
  const pausedCount = totalCount - activeCount

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Live Intel Ticker Management
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-medium">
                  Topbar Live Ticker
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Manage, prioritize, and toggle real-time regulatory & cutoff news streaming on the VidyaScope topbar.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn btn-primary btn-md flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm hover:shadow"
        >
          <Plus className="h-4 w-4" />
          <span>New Intel Alert</span>
        </button>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Alerts</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
            <Radio className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Active on Ticker</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{activeCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Paused / Inactive</p>
            <p className="text-2xl font-extrabold text-amber-700 mt-1">{pausedCount}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search intel headlines or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Filter className="h-3.5 w-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="all">All Categories</option>
            {PRESET_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="paused">Paused Only</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Category Badge</th>
                <th className="py-3 px-4">Intel Headline / Content</th>
                <th className="py-3 px-4">Destination Link</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Radio className="h-8 w-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold text-sm">No live intel alerts found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Create your first intel alert to stream on the public topbar.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id || alert._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className={`w-1.5 h-1.5 rounded-full ${alert.isActive ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
                        {alert.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-md">
                      <p className="line-clamp-2 leading-relaxed">{alert.text}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {alert.link ? (
                        <a
                          href={alert.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-brand-primary hover:underline font-mono text-[11px]"
                        >
                          <span className="truncate max-w-[120px]">{alert.link}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[11px]">
                        {alert.priority ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onToggleAlert && onToggleAlert(alert.id || alert._id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          alert.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${alert.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{alert.isActive ? 'Active' : 'Paused'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(alert)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-primary hover:bg-brand-accent/50 transition-colors cursor-pointer"
                          title="Edit Alert"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAlert(alert)
                            setDeleteModalOpen(true)
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Alert"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Alert Modal */}
      <AdminModal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        onConfirm={handleSubmit}
        title={modalMode === 'add' ? 'Create Live Intel Alert' : 'Edit Live Intel Alert'}
        description="This alert will scroll across the topbar ticker on the public VidyaScope portal."
        confirmText={modalMode === 'add' ? 'Publish Alert' : 'Update Alert'}
        isLoading={isProcessing}
      >
        <div className="space-y-4 pt-1">
          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category Tag
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`p-1.5 text-[10px] font-bold rounded-lg border text-left transition-all truncate cursor-pointer ${
                    formData.category === cat
                      ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: 'CUSTOM' })}
                className={`p-1.5 text-[10px] font-bold rounded-lg border text-left transition-all truncate cursor-pointer ${
                  formData.category === 'CUSTOM'
                    ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                + Custom Tag
              </button>
            </div>

            {formData.category === 'CUSTOM' && (
              <input
                type="text"
                placeholder="Enter custom category (e.g. SCHOLARSHIP ALERT)"
                value={formData.customCategory}
                onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs uppercase focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            )}
          </div>

          {/* Headline / Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Intel Headline / Message Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. IIT Bombay 2025-26 Median CTC Audited & Verified at ₹21.8 LPA"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          {/* Destination Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Destination URL / Path (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. /colleges/iit-bombay or /exams or https://..."
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          {/* Priority & Active Status */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Display Priority (Higher = First)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary h-4 w-4"
                />
                <span className="text-xs font-bold text-slate-800">Immediately Active</span>
              </label>
            </div>
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Live Intel Alert?"
        description="Are you sure you want to delete this live alert? It will immediately stop appearing on the public topbar."
        confirmText="Yes, Delete Alert"
        type="danger"
        isLoading={isProcessing}
      >
        {selectedAlert && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">
              {selectedAlert.category}
            </span>
            <p className="text-xs font-medium text-slate-800">{selectedAlert.text}</p>
          </div>
        )}
      </AdminModal>
    </div>
  )
}

export default LiveIntelManagementPage
