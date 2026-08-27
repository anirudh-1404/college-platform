import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'

const AuditLogPage = ({ auditLogs = [] }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchSearch =
        (log.target && log.target.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchSearch
    })
  }, [auditLogs, searchQuery])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Audit Logs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            History of administrative verifications, editorial revisions, and publishing events.
          </p>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-2xs overflow-hidden">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors text-xs">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{log.action}</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100">
                  {log.target}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{log.details}</p>
              <p className="text-[10px] text-slate-400">By: {log.adminUser || 'Admin'}</p>
            </div>

            <span className="text-[11px] text-slate-400 font-mono flex-shrink-0">
              {log.timestamp}
            </span>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="p-10 text-center text-xs text-slate-400">
            No audit records found.
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditLogPage
