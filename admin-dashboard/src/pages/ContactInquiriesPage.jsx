import React, { useState, useEffect, useMemo } from 'react'
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  Filter,
  User,
  ExternalLink,
  Edit3,
} from 'lucide-react'
import { adminService } from '../data/adminService'

const statusBadges = {
  new: { label: 'New Lead', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  contacted: { label: 'Contacted', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_progress: { label: 'In Counseling', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  enrolled: { label: 'Enrolled', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  closed: { label: 'Closed', bg: 'bg-slate-100 text-slate-600 border-slate-200' },
}

const ContactInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [streamFilter, setStreamFilter] = useState('all')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [counselorNotes, setCounselorNotes] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadInquiries = async () => {
    setLoading(true)
    try {
      const res = await adminService.getInquiries({
        status: statusFilter,
        stream: streamFilter,
        search: searchTerm,
      })
      setInquiries(res.inquiries || [])
      setCounts(res.counts || {})
    } catch (e) {
      console.error('Failed to load inquiries:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInquiries()
  }, [statusFilter, streamFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadInquiries()
  }

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await adminService.updateInquiryStatus(id, { status: newStatus })
      await loadInquiries()
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry((prev) => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return
    setUpdatingId(selectedInquiry.id)
    try {
      await adminService.updateInquiryStatus(selectedInquiry.id, { counselorNotes })
      await loadInquiries()
      setSelectedInquiry((prev) => ({ ...prev, counselorNotes }))
      alert('Notes saved successfully!')
    } catch (err) {
      alert('Failed to save notes: ' + err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from "${name}"?`)) return
    try {
      await adminService.deleteInquiry(id)
      if (selectedInquiry && selectedInquiry.id === id) setSelectedInquiry(null)
      await loadInquiries()
    } catch (err) {
      alert('Failed to delete inquiry: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <MessageSquare className="h-7 w-7 text-brand-primary" />
            <span>Contact Inquiries & Leads</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time student leads from VidyaScope Counseling form and College Profiles.
          </p>
        </div>
        <button
          onClick={loadInquiries}
          className="btn btn-outline btn-sm self-start sm:self-auto flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Leads</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{counts.all || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
          <p className="text-xs text-emerald-700 font-semibold uppercase">New / Unread</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{counts.new || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 bg-blue-50/20 shadow-xs">
          <p className="text-xs text-blue-700 font-semibold uppercase">Contacted</p>
          <p className="text-2xl font-extrabold text-blue-700 mt-1">{counts.contacted || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-100 bg-purple-50/20 shadow-xs">
          <p className="text-xs text-purple-700 font-semibold uppercase">Enrolled</p>
          <p className="text-2xl font-extrabold text-purple-700 mt-1">{counts.enrolled || 0}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, phone, email..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary focus:bg-white transition-colors"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </form>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">All Statuses ({counts.all || 0})</option>
            <option value="new">New Leads ({counts.new || 0})</option>
            <option value="contacted">Contacted ({counts.contacted || 0})</option>
            <option value="in_progress">In Counseling ({counts.in_progress || 0})</option>
            <option value="enrolled">Enrolled ({counts.enrolled || 0})</option>
            <option value="closed">Closed ({counts.closed || 0})</option>
          </select>

          {/* Stream Filter */}
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">All Streams</option>
            <option value="engineering">Engineering</option>
            <option value="management">Management</option>
            <option value="medical">Medical</option>
            <option value="law">Law</option>
          </select>
        </div>
      </div>

      {/* Main Table / Inquiries List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-brand-primary" />
            Loading student inquiries...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-base">No inquiries found</p>
            <p className="text-xs text-slate-400 mt-1">Student counseling requests will appear here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Stream & Target</th>
                  <th className="py-3.5 px-4">Target College / Source</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((item) => {
                  const badge = statusBadges[item.status] || statusBadges.new
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedInquiry(item)
                        setCounselorNotes(item.counselorNotes || '')
                      }}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.studentName}</div>
                        {item.budgetRange && (
                          <div className="text-[11px] text-slate-500">
                            Budget: {item.budgetRange.replace('-', ' to ')} L
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <a href={`tel:${item.phone}`} className="hover:text-brand-primary">
                            {item.phone}
                          </a>
                        </div>
                        {item.email && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <a href={`mailto:${item.email}`} className="hover:text-brand-primary truncate max-w-[150px]">
                              {item.email}
                            </a>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-slate-800">
                          {item.stream || 'General'}
                        </span>
                        <div className="text-[11px] text-slate-500">
                          Year: {item.admissionYear || '2025'}
                          {item.targetScore ? ` • Score: ${item.targetScore}` : ''}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {item.collegeName ? (
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-lg w-fit max-w-[220px]">
                            <Building2 className="h-3.5 w-3.5 text-brand-primary flex-shrink-0" />
                            <span className="truncate">{item.collegeName}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">General Counseling</span>
                        )}
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-1 font-semibold">
                          {item.source?.replace(/_/g, ' ') || 'Web Form'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${badge.bg}`}
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_progress">In Counseling</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInquiry(item)
                              setCounselorNotes(item.counselorNotes || '')
                            }}
                            className="p-1.5 text-slate-500 hover:text-brand-primary rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="View & Edit Notes"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.studentName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail & Counselor Notes Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedInquiry.studentName}</h2>
                <p className="text-xs text-slate-500">Inquiry ID: {selectedInquiry.id}</p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedInquiry.collegeName ? (
              <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                    🏛️
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider block">
                      Specific College Lead
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 leading-tight">
                      {selectedInquiry.collegeName}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                  {selectedInquiry.source?.replace(/_/g, ' ') || 'College Page'}
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium text-slate-700">Type: <strong>General Platform Inquiry</strong></span>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {selectedInquiry.source?.replace(/_/g, ' ') || 'Website'}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Phone</span>
                <p className="text-slate-900 font-bold mt-0.5">
                  <a href={`tel:${selectedInquiry.phone}`} className="hover:text-brand-primary">
                    {selectedInquiry.phone}
                  </a>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Email</span>
                <p className="text-slate-900 font-bold mt-0.5 truncate">
                  {selectedInquiry.email ? (
                    <a href={`mailto:${selectedInquiry.email}`} className="hover:text-brand-primary">
                      {selectedInquiry.email}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Stream & Score</span>
                <p className="text-slate-900 font-bold mt-0.5 capitalize">
                  {selectedInquiry.stream} {selectedInquiry.targetScore ? `(${selectedInquiry.targetScore})` : ''}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Status</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="w-full text-xs font-bold mt-1 bg-white border border-slate-200 rounded p-1"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Counseling</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {selectedInquiry.notes && (
              <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs">
                <span className="text-amber-800 font-bold">Student's Message:</span>
                <p className="text-amber-900 mt-1">{selectedInquiry.notes}</p>
              </div>
            )}

            {/* Counselor Internal Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Counselor Follow-up Notes</label>
              <textarea
                value={counselorNotes}
                onChange={(e) => setCounselorNotes(e.target.value)}
                rows={3}
                placeholder="Add notes from phone call, choice filling recommendation, etc."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="btn btn-outline btn-sm"
              >
                Close
              </button>
              <button
                type="button"
                disabled={updatingId === selectedInquiry.id}
                onClick={handleSaveNotes}
                className="btn btn-primary btn-sm"
              >
                {updatingId === selectedInquiry.id ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactInquiriesPage
