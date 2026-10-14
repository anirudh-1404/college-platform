import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Eye,
  Clock,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  Filter,
} from 'lucide-react'
import { adminService } from '../data/adminService'

const BLOG_CATEGORIES = [
  'Admissions & Cutoffs',
  'Exam Preparation',
  'Placement Insights',
  'Campus & Hostel Life',
  'College Comparisons',
]

const BlogsManagementPage = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  // Form State
  const initialFormState = {
    title: '',
    category: 'Admissions & Cutoffs',
    badge: '',
    coverImage: '',
    readTime: '5 min read',
    excerpt: '',
    content: '',
    tags: '',
    status: 'published',
    authorName: 'VidyaScope Editorial Team',
    authorRole: 'Senior Academic Counselor',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  }
  const [formData, setFormData] = useState(initialFormState)

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const data = await adminService.getBlogs()
      setBlogs(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load blogs:', err)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchSearch =
        !searchQuery ||
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory =
        categoryFilter === 'all' || b.category?.toLowerCase() === categoryFilter.toLowerCase()

      const matchStatus =
        statusFilter === 'all' || b.status === statusFilter

      return matchSearch && matchCategory && matchStatus
    })
  }, [blogs, searchQuery, categoryFilter, statusFilter])

  const handleOpenAddModal = () => {
    setEditingBlog(null)
    setFormData(initialFormState)
    setModalOpen(true)
  }

  const handleOpenEditModal = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title || '',
      category: blog.category || 'Admissions & Cutoffs',
      badge: blog.badge || '',
      coverImage: blog.coverImage || '',
      readTime: blog.readTime || '5 min read',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      status: blog.status || 'published',
      authorName: blog.author?.name || 'VidyaScope Editorial Team',
      authorRole: blog.author?.role || 'Senior Academic Counselor',
      authorAvatar: blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    })
    setModalOpen(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.')
      return
    }

    setUploadingImage(true)
    try {
      const url = await adminService.uploadImage(file, 'vidyascope/blogs')
      setFormData((prev) => ({ ...prev, coverImage: url }))
    } catch (err) {
      alert(err.message || 'Image upload failed. You can paste an image URL directly.')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Article title is required.')
      return
    }

    setIsProcessing(true)
    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        badge: formData.badge.trim() || formData.category,
        coverImage: formData.coverImage.trim() || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
        readTime: formData.readTime.trim() || '5 min read',
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        status: formData.status,
        author: {
          name: formData.authorName.trim(),
          role: formData.authorRole.trim(),
          avatar: formData.authorAvatar.trim(),
        },
      }

      if (editingBlog) {
        await adminService.updateBlog(editingBlog._id || editingBlog.id, payload)
      } else {
        await adminService.createBlog(payload)
      }

      setModalOpen(false)
      await fetchBlogs()
    } catch (err) {
      alert(err.message || 'Failed to save blog.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return
    setIsProcessing(true)
    try {
      await adminService.deleteBlog(blogToDelete._id || blogToDelete.id)
      setDeleteModalOpen(false)
      setBlogToDelete(null)
      await fetchBlogs()
    } catch (err) {
      alert(err.message || 'Failed to delete blog.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Blogs & Articles CMS
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
              {blogs.length} Articles
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Write, review, publish, and manage educational articles, cutoff analyses, and campus insights.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary-hover shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, excerpt, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
          >
            <option value="all">All Categories</option>
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Metrics</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
                    <span>Loading articles...</span>
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No blog articles found</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Create your first article or adjust filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((b) => (
                  <tr key={b._id || b.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Article Info */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.coverImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=120&q=80'}
                          alt={b.title}
                          className="w-12 h-9 object-cover rounded-md border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">
                            {b.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            /blogs/{b.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                        {b.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={b.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80'}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-semibold text-slate-800 text-[11px]">
                          {b.author?.name || 'VidyaScope'}
                        </span>
                      </div>
                    </td>

                    {/* Metrics */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          {b.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {b.readTime || '5m'}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`http://localhost:5175/blogs/${b.slug || b._id || b.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="Preview Live Page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => handleOpenEditModal(b)}
                          className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setBlogToDelete(b)
                            setDeleteModalOpen(true)
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isProcessing && setModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 z-10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingBlog ? 'Edit Blog Article' : 'Create New Blog Article'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Published articles appear instantly on the public website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. NIRF 2026 Rankings: What Changed for Tier-1 Colleges?"
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 font-medium"
                />
              </div>

              {/* Category, Badge, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                  >
                    {BLOG_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Badge Pill
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. NIRF 2026 / JEE Prep"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white font-semibold"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                  </button>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Excerpt (Summary for cards & meta description)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Concise 1-2 sentence teaser about the article..."
                  className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-600 leading-relaxed"
                />
              </div>

              {/* Rich Markdown Content */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Article Body (Markdown supported) *
                </label>
                <textarea
                  rows={9}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="## Section Heading&#10;&#10;Write detailed paragraphs here. Use **bold text** for emphasis.&#10;&#10;- Bullet point one&#10;- Bullet point two&#10;&#10;> Blockquote highlight"
                  className="w-full border border-slate-300 rounded-lg p-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 leading-relaxed"
                />
              </div>

              {/* Author & Read Time Details */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="nirf, rankings, engineering, admissions"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary-hover shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingBlog ? 'Update Article' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isProcessing && setDeleteModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-6 z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Blog Article</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to delete <strong className="text-slate-900">&ldquo;{blogToDelete.title}&rdquo;</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setDeleteModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleDeleteConfirm}
                className="px-3.5 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 cursor-pointer flex items-center gap-1.5"
              >
                {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogsManagementPage
