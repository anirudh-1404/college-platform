import React, { useState, useMemo } from 'react'
import {
  PageHeader,
  SectionCard,
  SaveBar,
  StatusBadge,
} from '../components/common/UIComponents'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  X,
  Check,
  Filter,
} from 'lucide-react'

const CoursesProgramsPage = ({
  collegeData,
  onUpdateCourses,
  onPreviewPublic,
}) => {
  const [courses, setCourses] = useState([...collegeData.courses])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState('all') // 'all' | 'Undergraduate' | 'Postgraduate'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Form state for Modal
  const [modalForm, setModalForm] = useState({
    name: '',
    degree: 'B.Tech (Undergraduate)',
    duration: '4 Years (8 Semesters)',
    eligibility: '',
    fees: '',
    seats: '',
    level: 'Undergraduate',
    specializationsText: '',
  })

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.eligibility.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterLevel === 'all' || c.level === filterLevel

      return matchesSearch && matchesFilter
    })
  }, [courses, searchQuery, filterLevel])

  const handleOpenAddModal = () => {
    setEditingCourse(null)
    setModalForm({
      name: '',
      degree: 'B.Tech (Undergraduate)',
      duration: '4 Years (8 Semesters)',
      eligibility: '10+2 with PCM (min 75% aggregate) + Entrance Rank',
      fees: '₹2,24,000 / Year',
      seats: 120,
      level: 'Undergraduate',
      specializationsText: 'Artificial Intelligence, Systems, Data Science',
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (course) => {
    setEditingCourse(course)
    setModalForm({
      name: course.name,
      degree: course.degree,
      duration: course.duration,
      eligibility: course.eligibility,
      fees: course.fees,
      seats: course.seats,
      level: course.level,
      specializationsText: course.specializations ? course.specializations.join(', ') : '',
    })
    setIsModalOpen(true)
  }

  const handleSaveModal = (e) => {
    e.preventDefault()
    const specsArray = modalForm.specializationsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (editingCourse) {
      // Update existing course
      const updated = courses.map((c) =>
        c.id === editingCourse.id
          ? {
              ...c,
              name: modalForm.name,
              degree: modalForm.degree,
              duration: modalForm.duration,
              eligibility: modalForm.eligibility,
              fees: modalForm.fees,
              seats: Number(modalForm.seats) || 0,
              level: modalForm.level,
              specializations: specsArray,
            }
          : c
      )
      setCourses(updated)
    } else {
      // Add new course
      const newCourse = {
        id: `course-${Date.now()}`,
        name: modalForm.name,
        degree: modalForm.degree,
        duration: modalForm.duration,
        eligibility: modalForm.eligibility,
        fees: modalForm.fees,
        seats: Number(modalForm.seats) || 0,
        level: modalForm.level,
        specializations: specsArray,
      }
      setCourses([newCourse, ...courses])
    }

    setIsModalOpen(false)
    setHasUnsavedChanges(true)
  }

  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to remove this course from the public listing?')) {
      setCourses(courses.filter((c) => c.id !== id))
      setHasUnsavedChanges(true)
    }
  }

  const handleSaveAll = () => {
    if (onUpdateCourses) {
      onUpdateCourses(courses)
    }
    setHasUnsavedChanges(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleReset = () => {
    setCourses([...collegeData.courses])
    setHasUnsavedChanges(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Courses & Degree Programs"
        subtitle="Manage the academic programs, seat matrix, duration, and fee structures visible on the public Courses tab."
        badge={<StatusBadge status={collegeData.status} />}
        onSave={handleSaveAll}
        onPreview={onPreviewPublic}
        savedSuccess={savedSuccess}
        extraActions={
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="btn btn-primary btn-md cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Course</span>
          </button>
        }
      />

      {/* Main Table Card */}
      <SectionCard
        title={`Offered Programs (${courses.length})`}
        description="Every course listed here directly populates the public courses directory and detail page."
      >
        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course name or degree..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-border-color focus:border-brand-primary outline-none text-xs font-medium"
            />
            <Search className="h-4 w-4 text-text-light absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-light flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Level:</span>
            </span>
            {['all', 'Undergraduate', 'Postgraduate'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  filterLevel === level
                    ? 'bg-brand-primary text-white font-bold'
                    : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                }`}
              >
                {level === 'all' ? 'All' : level}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table UI */}
        <div className="overflow-x-auto custom-scrollbar border border-border-color rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-border-color text-text-secondary font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Course Name & Specializations</th>
                <th className="py-3 px-4">Degree & Level</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Annual / Total Fee</th>
                <th className="py-3 px-4">Intake Seats</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color bg-white">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-serif font-bold text-text-primary text-xs sm:text-sm">
                        {course.name}
                      </div>
                      <div className="text-[11px] text-text-light mt-0.5 max-w-sm line-clamp-1">
                        {course.eligibility}
                      </div>
                      {course.specializations && course.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {course.specializations.slice(0, 3).map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-1.5 py-0.2 rounded bg-slate-100 text-text-secondary text-[10px] font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-text-secondary">
                      <span className="px-2 py-0.5 rounded bg-brand-accent text-brand-primary text-[11px] font-bold">
                        {course.degree}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-text-secondary font-medium">
                      {course.duration}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-text-primary">
                      {course.fees}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {course.seats} Seats
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(course)}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-brand-accent transition-colors cursor-pointer"
                        title="Edit course"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-light text-xs">
                    No courses found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border-color p-6 sm:p-7 z-10 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-border-color">
              <h3 className="font-serif text-lg font-bold text-text-primary">
                {editingCourse ? 'Edit Course Program' : 'Add New Course Program'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-text-light hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Course Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  placeholder="e.g. B.Tech in Computer Science & Engineering"
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Degree / Qualification *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.degree}
                    onChange={(e) => setModalForm({ ...modalForm, degree: e.target.value })}
                    placeholder="e.g. B.Tech / MBA / MBBS"
                    className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Academic Level *
                  </label>
                  <select
                    value={modalForm.level}
                    onChange={(e) => setModalForm({ ...modalForm, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                  >
                    <option value="Undergraduate">Undergraduate (UG)</option>
                    <option value="Postgraduate">Postgraduate (PG)</option>
                    <option value="Doctorate">Doctorate (Ph.D)</option>
                    <option value="Diploma">Diploma / Certificate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.duration}
                    onChange={(e) => setModalForm({ ...modalForm, duration: e.target.value })}
                    placeholder="e.g. 4 Years (8 Semesters)"
                    className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                    Total Seat Intake *
                  </label>
                  <input
                    type="number"
                    required
                    value={modalForm.seats}
                    onChange={(e) => setModalForm({ ...modalForm, seats: e.target.value })}
                    placeholder="e.g. 175"
                    className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Annual / Total Fees *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.fees}
                  onChange={(e) => setModalForm({ ...modalForm, fees: e.target.value })}
                  placeholder="e.g. ₹2,24,000 / Year (₹8.96 Lakhs Total)"
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Eligibility Criteria *
                </label>
                <textarea
                  rows={2}
                  required
                  value={modalForm.eligibility}
                  onChange={(e) => setModalForm({ ...modalForm, eligibility: e.target.value })}
                  placeholder="e.g. 10+2 with Physics, Chem, Math (min 75%) + Top Rank in JEE Advanced"
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Specializations (Comma separated)
                </label>
                <input
                  type="text"
                  value={modalForm.specializationsText}
                  onChange={(e) => setModalForm({ ...modalForm, specializationsText: e.target.value })}
                  placeholder="e.g. AI & ML, Data Science, Cybersecurity"
                  className="w-full px-3 py-2 rounded-xl border border-border-color focus:border-brand-primary outline-none text-xs font-medium bg-white"
                />
              </div>

              <div className="pt-3 border-t border-border-color flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  <span>{editingCourse ? 'Update Course' : 'Add Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Save Bar */}
      <SaveBar
        show={hasUnsavedChanges}
        onSave={handleSaveAll}
        onReset={handleReset}
      />
    </div>
  )
}

export default CoursesProgramsPage
