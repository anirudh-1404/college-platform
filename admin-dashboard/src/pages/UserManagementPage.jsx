import React, { useState, useMemo } from 'react'
import {
  Users,
  Search,
  UserPlus,
  ShieldCheck,
  Trash2,
  Lock,
  Mail,
  Key,
} from 'lucide-react'
import { AdminModal } from '../components/common/AdminModal'

const UserManagementPage = ({
  users = [],
  onAddUser,
  onDeleteUser,
  onToggleStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Modals State
  const [addUserModalOpen, setAddUserModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Add Admin Form State - EXACTLY Name, Email, Password, Role (Admin)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin',
  })

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      return matchSearch
    })
  }, [users, searchQuery])

  const handleConfirmAddAdmin = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert('Please fill in Name, Email, and Password.')
      return
    }

    setIsProcessing(true)
    try {
      await onAddUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: 'Admin',
      })
      setAddUserModalOpen(false)
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Admin',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return
    setIsProcessing(true)
    try {
      await onDeleteUser(selectedUser.id)
      setDeleteModalOpen(false)
      setSelectedUser(null)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-border-color rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-primary" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
                Admin Users Management
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Add and manage authorized platform administrators with full editorial and verification access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAddUserModalOpen(true)}
            className="btn btn-primary btn-md text-xs font-bold cursor-pointer flex-shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New Admin</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="pt-2 flex items-center justify-between border-t border-border-color">
          <div className="text-xs font-semibold text-text-secondary">
            Total Admins: <strong className="text-text-primary">{users.length}</strong>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search admin by name or email..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-border-color rounded-xl text-xs font-medium text-text-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="bg-white border border-border-color rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-border-color text-text-primary font-bold">
                <th className="py-3.5 px-4 min-w-[200px]">Admin Name</th>
                <th className="py-3.5 px-4 min-w-[200px]">Email Address</th>
                <th className="py-3.5 px-4 min-w-[120px]">Role</th>
                <th className="py-3.5 px-4 min-w-[120px]">Created Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredUsers.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-serif text-xs font-bold text-text-primary">
                      {admin.name}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-xs text-text-secondary">
                      {admin.email}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-50 text-brand-primary border border-purple-200 text-[11px] font-bold">
                      <Key className="h-3 w-3 text-brand-primary" />
                      <span>Admin</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-text-secondary">
                    {admin.createdAt || 'Recent'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUser(admin)
                        setDeleteModalOpen(true)
                      }}
                      className="btn btn-outline text-rose-600 hover:bg-rose-50 btn-sm text-xs cursor-pointer inline-flex items-center gap-1"
                      title="Remove Admin"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-text-light">
                    No administrators found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Admin Modal - EXACTLY 3 Fields: Name, Email, Password + Role: Admin */}
      {addUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setAddUserModalOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-2xl border border-border-color shadow-2xl max-w-md w-full p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-color">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-brand-primary" />
                <h3 className="font-serif text-base font-bold text-text-primary">
                  Add New Admin
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAddUserModalOpen(false)}
                className="text-text-light hover:text-text-primary cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAddAdmin} className="space-y-4 text-xs">
              {/* Field 1: Name */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-border-color rounded-xl text-xs font-medium text-text-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              {/* Field 2: Email */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. rahul@vidyascope.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-border-color rounded-xl text-xs font-medium text-text-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              {/* Field 3: Password */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-border-color rounded-xl text-xs font-medium text-text-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              {/* Field 4: Role (By Default Admin) */}
              <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-text-secondary">Assigned Role:</span>
                <span className="font-bold text-brand-primary">Admin (Default)</span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setAddUserModalOpen(false)}
                  className="btn btn-outline btn-md text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary btn-md text-xs font-bold cursor-pointer"
                >
                  {isProcessing ? 'Adding...' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Admin Account"
        description={`Revoke access for ${selectedUser?.name}.`}
        confirmText="Remove Admin"
        type="danger"
        isLoading={isProcessing}
      >
        <p className="text-text-secondary leading-relaxed">
          Are you sure you want to remove <strong>{selectedUser?.name}</strong> ({selectedUser?.email}) from the admin team?
        </p>
      </AdminModal>
    </div>
  )
}

export default UserManagementPage
