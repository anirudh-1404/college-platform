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
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code,
  Globe,
  Sparkles,
  Edit3,
} from 'lucide-react'
import { adminService } from '../data/adminService'
import { usePortalUrls } from '../data/portalNavigation'

const BLOG_CATEGORIES = [
  'Admissions & Cutoffs',
  'Exam Preparation',
  'Placement Insights',
  'Campus & Hostel Life',
  'College Comparisons',
  'Career Guidance',
  'Scholarships & Fees',
  'Other',
]

// Live Formatted Preview Renderer for Admin Editor
const AdminBlogPreview = ({ content, title, category, coverImage, authorName, readTime, authorAvatar }) => {
  if (!content) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <p className="text-sm font-medium">Article content preview will appear here...</p>
        <p className="text-xs mt-1">Start typing in the &ldquo;Write&rdquo; tab to see real-time formatting with headings, bold text, underlines, links and images.</p>
      </div>
    )
  }

  const formatInline = (raw) => {
    if (!raw) return ''
    return raw
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-4 rounded-xl border border-slate-200 w-full max-h-[380px] object-cover shadow-xs" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline font-semibold hover:text-blue-800 transition-colors">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
      .replace(/<u>(.*?)<\/u>/gi, '<u class="underline decoration-purple-600 decoration-2 underline-offset-2 font-medium">$1</u>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-purple-700 border border-slate-200">$1</code>')
  }

  const blocks = content.split(/\n\n+/)

  return (
    <div className="p-5 sm:p-6 bg-white rounded-xl border border-slate-200 space-y-5">
      <div className="space-y-2 pb-4 border-b border-slate-100">
        <span className="px-2.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
          {category || 'General'}
        </span>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          {title || 'Untitled Article'}
        </h1>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <img src={authorAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
            <span className="font-semibold text-slate-700">{authorName}</span>
          </div>
          <span>•</span>
          <span>{readTime}</span>
        </div>
      </div>

      {coverImage && (
        <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-100 max-h-[320px]">
          <img src={coverImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="space-y-3.5 text-slate-700 text-xs sm:text-sm leading-relaxed">
        {blocks.map((block, idx) => {
          const trimmed = block.trim()
          if (!trimmed) return null

          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="font-serif text-lg sm:text-xl font-bold text-slate-900 pt-3 pb-1 border-b border-slate-100 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full inline-block" />
                <span>{trimmed.replace(/^##\s+/, '')}</span>
              </h2>
            )
          }

          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-serif text-base sm:text-lg font-bold text-slate-800 pt-2">
                {trimmed.replace(/^###\s+/, '')}
              </h3>
            )
          }

          if (trimmed.startsWith('> ')) {
            const q = trimmed.replace(/^>\s*/gm, '')
            return (
              <div key={idx} className="my-3 p-3.5 bg-purple-50/60 border-l-4 border-purple-600 rounded-r-xl text-slate-800 text-xs italic font-medium" dangerouslySetInnerHTML={{ __html: formatInline(q) }} />
            )
          }

          if (trimmed === '---' || trimmed === '***') {
            return <hr key={idx} className="my-4 border-slate-200" />
          }

          if (trimmed.startsWith('```')) {
            const code = trimmed.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '')
            return (
              <pre key={idx} className="bg-slate-900 text-slate-100 p-3 rounded-xl overflow-x-auto text-[11px] font-mono my-2.5">
                <code>{code}</code>
              </pre>
            )
          }

          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split(/\n[-*]\s+/).filter(Boolean)
            return (
              <ul key={idx} className="space-y-1.5 my-2.5 pl-1">
                {items.map((it, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: formatInline(it.replace(/^[-*]\s*/, '').trim()) }} />
                  </li>
                ))}
              </ul>
            )
          }

          if (/^\d+\.\s/.test(trimmed)) {
            const items = trimmed.split(/\n\d+\.\s+/).filter(Boolean)
            return (
              <ol key={idx} className="list-decimal list-inside space-y-1 my-2.5 text-slate-700">
                {items.map((it, iIdx) => (
                  <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInline(it.replace(/^\d+\.\s*/, '').trim()) }} />
                ))}
              </ol>
            )
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
          )
        })}
      </div>
    </div>
  )
}

const BlogsManagementPage = () => {
  const { publicWebsiteUrl } = usePortalUrls()
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
  const [uploadingEditorImage, setUploadingEditorImage] = useState(false)
  const [editorTab, setEditorTab] = useState('write') // 'write' | 'preview'
  const fileInputRef = useRef(null)
  const editorImageInputRef = useRef(null)
  const contentTextareaRef = useRef(null)

  // Form State
  const initialFormState = {
    title: '',
    category: 'Admissions & Cutoffs',
    customCategory: '',
    badge: '',
    coverImage: '',
    readTime: '5 min read',
    excerpt: '',
    content: '',
    tags: '',
    seoTitle: '',
    metaDescription: '',
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
    setEditorTab('write')
    setModalOpen(true)
  }

  const handleOpenEditModal = (blog) => {
    setEditingBlog(blog)
    const isStandardCat = BLOG_CATEGORIES.includes(blog.category)
    setFormData({
      title: blog.title || '',
      category: isStandardCat ? blog.category : (blog.category ? 'Other' : 'Admissions & Cutoffs'),
      customCategory: !isStandardCat && blog.category ? blog.category : '',
      badge: blog.badge || '',
      coverImage: blog.coverImage || '',
      readTime: blog.readTime || '5 min read',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      seoTitle: blog.seoTitle || '',
      metaDescription: blog.metaDescription || '',
      status: blog.status || 'published',
      authorName: blog.author?.name || 'VidyaScope Editorial Team',
      authorRole: blog.author?.role || 'Senior Academic Counselor',
      authorAvatar: blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    })
    setEditorTab('write')
    setModalOpen(true)
  }

  // Formatting Insertion Helper for Rich Textarea
  const insertFormatting = (prefix, suffix = '', placeholder = 'text') => {
    const textarea = contentTextareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentVal = formData.content || ''
    const selected = currentVal.substring(start, end) || placeholder
    const replacement = `${prefix}${selected}${suffix}`
    const nextContent = currentVal.substring(0, start) + replacement + currentVal.substring(end)
    setFormData((prev) => ({ ...prev, content: nextContent }))
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length)
    }, 0)
  }

  const handleInsertLink = () => {
    const url = window.prompt('Enter destination URL (e.g. https://example.com):', 'https://')
    if (!url || url === 'https://') return
    const title = window.prompt('Enter link anchor text:', 'Click here to read more') || 'Read More'
    insertFormatting(`[${title}](`, `${url})`, '')
  }

  const handleInsertImagePrompt = () => {
    const url = window.prompt('Enter image URL (https://...):', 'https://')
    if (!url || url === 'https://') return
    const alt = window.prompt('Enter image caption / alt text:', 'Campus Infographic') || 'Image'
    insertFormatting(`\n![${alt}](`, `${url})\n`, '')
  }

  const handleEditorImageUpload = async (e) => {
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

    setUploadingEditorImage(true)
    try {
      const url = await adminService.uploadImage(file, 'vidyascope/blogs')
      const caption = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      insertFormatting(`\n![${caption}](`, `${url})\n`, '')
    } catch (err) {
      alert(err.message || 'Image upload failed. You can paste an image URL directly.')
    } finally {
      setUploadingEditorImage(false)
      if (editorImageInputRef.current) editorImageInputRef.current.value = ''
    }
  }

  const handleContentKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault()
        insertFormatting('**', '**', 'bold text')
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault()
        insertFormatting('*', '*', 'italic text')
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault()
        insertFormatting('<u>', '</u>', 'underlined text')
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault()
        handleInsertLink()
      }
    }
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
    if (!formData.content.trim()) {
      alert('Article content is required.')
      return
    }

    setIsProcessing(true)
    try {
      const resolvedCategory =
        formData.category === 'Other'
          ? (formData.customCategory.trim() || 'General Insights')
          : formData.category

      const payload = {
        title: formData.title.trim(),
        category: resolvedCategory,
        badge: formData.badge.trim() || resolvedCategory,
        coverImage: formData.coverImage.trim() || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
        readTime: formData.readTime.trim() || '5 min read',
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        seoTitle: (formData.seoTitle || formData.title).trim(),
        metaDescription: (formData.metaDescription || formData.excerpt).trim(),
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
                          href={`${publicWebsiteUrl}/blogs/${b.slug || b._id || b.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                          title="Preview Live on Vidyascope"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            onClick={() => !isProcessing && setModalOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar p-5 sm:p-7 z-10 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {editingBlog ? 'Edit Blog Article' : 'Create New Blog Article'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Full control over rich formatting, category associations, and SEO metadata.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-5 text-xs">
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
                  placeholder="e.g. NIRF 2026 Rankings: What Changed for Tier-1 Engineering Colleges?"
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 font-semibold text-slate-900"
                />
              </div>

              {/* Category, Custom Category, Badge, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white font-medium"
                  >
                    {BLOG_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {formData.category === 'Other' && (
                    <input
                      type="text"
                      required
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      placeholder="Type custom category name..."
                      className="mt-2 w-full border border-purple-300 bg-purple-50/40 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 font-medium"
                    />
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">
                    Related blogs are automatically grouped by this category.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Badge Pill (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. NIRF 2026 / Cutoff Guide"
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Small highlighted tag displayed on article cards.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Publish Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white font-semibold text-slate-800"
                  >
                    <option value="published">🟢 Published (Live for Students)</option>
                    <option value="draft">🟡 Draft (Admin Only)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Drafts will not appear on the student portal.
                  </p>
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
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 font-mono text-[11px]"
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
                    className="px-3.5 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Cover'}</span>
                  </button>
                </div>
                {formData.coverImage && (
                  <div className="mt-2 flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-lg max-w-sm">
                    <img
                      src={formData.coverImage}
                      alt="Cover Preview"
                      className="w-12 h-8 rounded object-cover border border-slate-200"
                    />
                    <span className="text-[11px] text-slate-500 truncate flex-1 font-mono">
                      {formData.coverImage}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, coverImage: '' }))}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Rich Markdown & Formatted Article Content */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span>Article Content & Description *</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        (Supports Bold, Underline, Links, Headings, Images, Quotes)
                      </span>
                    </label>
                  </div>

                  {/* Tab Switcher: Write vs Live Preview */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setEditorTab('write')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        editorTab === 'write'
                          ? 'bg-white text-purple-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Write</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        editorTab === 'preview'
                          ? 'bg-white text-purple-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </button>
                  </div>
                </div>

                {editorTab === 'write' ? (
                  <div className="border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-600/30 focus-within:border-purple-600 bg-white">
                    {/* Rich Text Editor Toolbar */}
                    <div className="flex items-center flex-wrap gap-1.5 p-2.5 bg-slate-100/90 border-b border-slate-200 text-slate-800">
                      {/* Bold, Italic, Underline Group */}
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => insertFormatting('**', '**', 'bold text')}
                          title="Bold (Ctrl+B)"
                          className="px-2.5 py-1 rounded-md hover:bg-purple-50 hover:text-purple-700 active:bg-purple-100 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer border border-transparent hover:border-purple-200 text-slate-800"
                        >
                          <Bold className="w-3.5 h-3.5 stroke-[2.8]" />
                          <span>Bold</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('*', '*', 'italic text')}
                          title="Italic (Ctrl+I)"
                          className="px-2.5 py-1 rounded-md hover:bg-purple-50 hover:text-purple-700 active:bg-purple-100 flex items-center gap-1.5 text-xs transition-all cursor-pointer border border-transparent hover:border-purple-200 text-slate-800"
                        >
                          <Italic className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span className="italic font-semibold">Italic</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('<u>', '</u>', 'underlined text')}
                          title="Underline (Ctrl+U)"
                          className="px-2.5 py-1 rounded-md hover:bg-purple-50 hover:text-purple-700 active:bg-purple-100 flex items-center gap-1.5 text-xs transition-all cursor-pointer border border-transparent hover:border-purple-200 text-slate-800"
                        >
                          <Underline className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span className="underline decoration-2 underline-offset-2 font-semibold">Underline</span>
                        </button>
                      </div>

                      {/* Headings Group */}
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n## ', '\n', 'Main Section Heading')}
                          title="Heading 2"
                          className="px-2 py-1 rounded-md hover:bg-purple-50 hover:text-purple-700 font-bold flex items-center gap-1 text-xs transition-all cursor-pointer text-slate-700"
                        >
                          <Heading2 className="w-3.5 h-3.5" />
                          <span>H2</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n### ', '\n', 'Sub-Heading Title')}
                          title="Heading 3"
                          className="px-2 py-1 rounded-md hover:bg-purple-50 hover:text-purple-700 font-bold flex items-center gap-1 text-xs transition-all cursor-pointer text-slate-700"
                        >
                          <Heading3 className="w-3.5 h-3.5" />
                          <span>H3</span>
                        </button>
                      </div>

                      {/* Link & Media Group */}
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={handleInsertLink}
                          title="Insert Link (Ctrl+K)"
                          className="px-2.5 py-1 rounded-md hover:bg-blue-50 text-blue-600 font-semibold flex items-center gap-1.5 text-xs transition-all cursor-pointer"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Link</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleInsertImagePrompt}
                          title="Insert Image from URL"
                          className="px-2.5 py-1 rounded-md hover:bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1.5 text-xs transition-all cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Image URL</span>
                        </button>
                        <input
                          ref={editorImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleEditorImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploadingEditorImage}
                          onClick={() => editorImageInputRef.current?.click()}
                          title="Upload & Insert Inline Image"
                          className="px-2.5 py-1 rounded-md hover:bg-purple-50 text-purple-700 font-semibold flex items-center gap-1.5 text-xs transition-all cursor-pointer"
                        >
                          {uploadingEditorImage ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>Upload Img</span>
                        </button>
                      </div>

                      {/* Lists, Quote, Divider Group */}
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n- ', '\n', 'Bullet point item')}
                          title="Bulleted List"
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n1. ', '\n', 'Numbered list item')}
                          title="Numbered List"
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n> ', '\n', 'Important quote or advisory note')}
                          title="Blockquote Callout"
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Quote className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n\n---\n\n', '', '')}
                          title="Divider Line"
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('`', '`', 'code')}
                          title="Inline Code"
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer font-mono"
                        >
                          <Code className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="ml-auto text-[10px] text-slate-400 hidden lg:block">
                        Hotkeys: Ctrl+B (Bold) • Ctrl+I (Italic) • Ctrl+U (Underline) • Ctrl+K (Link)
                      </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                      ref={contentTextareaRef}
                      rows={12}
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      onKeyDown={handleContentKeyDown}
                      placeholder="## Introduction&#10;&#10;Write comprehensive article text here... You can use **bold text**, <u>underlines</u>, [clickable links](https://vidyascope.com), and images:&#10;&#10;![Campus Infographic](https://images.unsplash.com/photo-1523240795612-9a054b0db644)&#10;&#10;> Expert tip: Keep eligibility documents ready for counseling rounds."
                      className="w-full p-3.5 font-mono text-xs focus:outline-none leading-relaxed text-slate-800 placeholder:text-slate-400 custom-scrollbar resize-y"
                    />
                  </div>
                ) : (
                  <div className="max-h-[500px] overflow-y-auto custom-scrollbar rounded-xl border border-slate-200">
                    <AdminBlogPreview
                      content={formData.content}
                      title={formData.title}
                      category={formData.category === 'Other' ? (formData.customCategory || 'Custom') : formData.category}
                      coverImage={formData.coverImage}
                      authorName={formData.authorName}
                      readTime={formData.readTime}
                      authorAvatar={formData.authorAvatar}
                    />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Card Excerpt / Short Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Concise 1-2 sentence teaser shown on blog listing cards..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600 leading-relaxed text-slate-800"
                />
              </div>

              {/* SEO & Search Engine Optimization Card */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-2xl border border-purple-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        SEO Metadata & Google Search Preview
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Customize what search engines index and what users see in Google search results.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                    Google SEO Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SEO Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700">
                        SEO Meta Title
                      </label>
                      <span
                        className={`text-[10px] font-mono font-medium ${
                          (formData.seoTitle || formData.title).length > 60
                            ? 'text-amber-600 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {(formData.seoTitle || formData.title).length}/60 chars (Recommended 50-60)
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder={formData.title ? `${formData.title} | VidyaScope` : 'Custom SEO title for Google...'}
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>

                  {/* SEO Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700">
                        SEO Meta Description
                      </label>
                      <span
                        className={`text-[10px] font-mono font-medium ${
                          (formData.metaDescription || formData.excerpt).length > 160
                            ? 'text-amber-600 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {(formData.metaDescription || formData.excerpt).length}/160 chars (Recommended 150-160)
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder={formData.excerpt || 'Brief meta description that will display below the Google search snippet...'}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 leading-relaxed text-xs"
                    />
                  </div>
                </div>

                {/* Live Google Search Result Simulator */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>Google Search Result Snippet Preview</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-sans truncate">
                    https://vidyascope.com › blogs › {formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'article-slug'}
                  </div>
                  <div className="text-sm sm:text-base font-medium text-blue-700 hover:underline cursor-pointer truncate font-sans">
                    {formData.seoTitle || formData.title || 'VidyaScope Blog Article Title | College Admissions & Cutoffs'}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-sans">
                    {formData.metaDescription || formData.excerpt || 'Read comprehensive guides, cutoff analysis, placement statistics, and campus updates on VidyaScope to make informed college admission decisions.'}
                  </p>
                </div>
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
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
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
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
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
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
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
                  placeholder="nirf, rankings, engineering, cutoffs, 2026"
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary-hover shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{editingBlog ? 'Save & Update Article' : 'Publish Article'}</span>
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
