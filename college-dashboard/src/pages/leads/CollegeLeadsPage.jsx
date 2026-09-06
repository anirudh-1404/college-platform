import React, { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Clock,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react'
import { collegeService } from '../../data/collegeService'

const statusBadges = {
  new: { label: 'New Lead', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  contacted: { label: 'Contacted', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_progress: { label: 'In Counseling', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  enrolled: { label: 'Enrolled', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  closed: { label: 'Closed', bg: 'bg-slate-100 text-slate-600 border-slate-200' },
}

const CollegeLeadsPage = ({ collegeData }) => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadLeads = async () => {
    setLoading(true)
    try {
      const data = await collegeService.getCollegeLeads()
      setLeads(data || [])
    } catch (e) {
      console.error('Failed to load college leads:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      !term ||
      lead.studentName?.toLowerCase().includes(term) ||
      lead.phone?.includes(term) ||
      lead.email?.toLowerCase().includes(term)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Student Inquiries & Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct admission queries and counseling requests for {collegeData?.name || 'your institution'}.
          </p>
        </div>

        <button
          onClick={loadLeads}
          className="btn btn-outline btn-sm self-start sm:self-auto flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Inquiries</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{leads.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
          <p className="text-xs text-emerald-700 font-semibold uppercase">New Leads</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
            {leads.filter((l) => l.status === 'new').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 bg-blue-50/20 shadow-xs">
          <p className="text-xs text-blue-700 font-semibold uppercase">Contacted</p>
          <p className="text-2xl font-extrabold text-blue-700 mt-1">
            {leads.filter((l) => l.status === 'contacted').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-100 bg-purple-50/20 shadow-xs">
          <p className="text-xs text-purple-700 font-semibold uppercase">Admitted / Enrolled</p>
          <p className="text-2xl font-extrabold text-purple-700 mt-1">
            {leads.filter((l) => l.status === 'enrolled').length}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name, phone, email..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary focus:bg-white"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Statuses ({leads.length})</option>
          <option value="new">New Leads</option>
          <option value="contacted">Contacted</option>
          <option value="in_progress">In Counseling</option>
          <option value="enrolled">Enrolled</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-brand-primary" />
            Loading student leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Users className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-base">No student leads yet</p>
            <p className="text-xs text-slate-400 mt-1">
              When students request counseling or information for your college, their details will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Stream & Target</th>
                  <th className="py-3.5 px-4">Inquiry Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Notes / Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((item) => {
                  const badge = statusBadges[item.status] || statusBadges.new
                  return (
                    <tr key={item.id || item._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {item.studentName}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <a href={`tel:${item.phone}`} className="hover:text-brand-primary">
                            {item.phone}
                          </a>
                        </div>
                        {item.email && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <a href={`mailto:${item.email}`} className="hover:text-brand-primary">
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

                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border inline-block ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                        {item.notes || '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollegeLeadsPage
