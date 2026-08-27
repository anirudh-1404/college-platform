import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Copy, GraduationCap } from 'lucide-react'
import { FormField, TextInput, Textarea, SelectInput, TagInput } from '../../components/common/FormControls'
import { ConfirmationModal } from '../../components/common/ConfirmationModal'
import { DEGREE_LEVEL_OPTIONS } from '../../data/collegeModel'

const EMPTY_COURSE = {
  id: '',
  name: '',
  degreeLevel: 'Undergraduate (B.Tech)',
  duration: '4 Years (8 Semesters)',
  fee: '₹8.00 Lakhs',
  annualFee: '₹2.00 Lakhs/Yr',
  totalFeeNumeric: 8.0,
  seatIntake: 60,
  eligibility: '10+2 with Physics, Chemistry, Math (min 60% aggregate) + National Entrance Rank',
  avgSalary: '₹12.0 LPA',
  highestSalary: '₹35.0 LPA',
  overview: 'Comprehensive degree program integrating foundational engineering theory with practical industry applications.',
  admissionProcess: 'Centralized state/national counseling based on entrance exam merit rank.',
  specializations: [],
  careerOutcomes: [],
}

const Step3CoursesFees = ({ collegeData, onChange, isReadOnly = false }) => {
  const courses = collegeData.coursesOffered || []

  // Editor Modal / Inline Form State
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [courseFormData, setCourseFormData] = useState(EMPTY_COURSE)
  const [errors, setErrors] = useState({})

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)

  // Open Add New Course
  const handleAddNew = () => {
    setEditingCourse(null)
    setCourseFormData({
      ...EMPTY_COURSE,
      id: `course_${courses.length + 1}`,
    })
    setErrors({})
    setIsEditorOpen(true)
  }

  // Open Edit Course
  const handleEdit = (course) => {
    setEditingCourse(course)
    setCourseFormData({ ...course })
    setErrors({})
    setIsEditorOpen(true)
  }

  // Duplicate Course
  const handleDuplicate = (course) => {
    const newCourse = {
      ...course,
      id: `course_copy_${courses.length + 1}`,
      name: `${course.name} (Copy)`,
    }
    const updated = [...courses, newCourse]
    onChange({ ...collegeData, coursesOffered: updated })
  }

  // Confirm Delete
  const handleDeleteClick = (course) => {
    setCourseToDelete(course)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!courseToDelete) return
    const updated = courses.filter((c) => c.id !== courseToDelete.id)
    onChange({ ...collegeData, coursesOffered: updated })
    setDeleteModalOpen(false)
    setCourseToDelete(null)
  }

  // Validate Course Form
  const validate = () => {
    const errs = {}
    if (!courseFormData.name.trim()) errs.name = 'Course name is required.'
    if (!courseFormData.degreeLevel) errs.degreeLevel = 'Degree level is required.'
    if (!courseFormData.duration.trim()) errs.duration = 'Duration is required.'
    if (!courseFormData.fee.trim()) errs.fee = 'Total fee string is required.'
    if (!courseFormData.seatIntake || courseFormData.seatIntake <= 0) {
      errs.seatIntake = 'Valid seat intake is required.'
    }
    if (!courseFormData.eligibility.trim()) errs.eligibility = 'Eligibility description is required.'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Save Course
  const handleSaveCourse = (e) => {
    e.preventDefault()
    if (!validate()) return

    let updatedCourses = []
    if (editingCourse) {
      updatedCourses = courses.map((c) =>
        c.id === editingCourse.id ? { ...courseFormData } : c
      )
    } else {
      updatedCourses = [...courses, { ...courseFormData }]
    }

    onChange({
      ...collegeData,
      coursesOffered: updatedCourses,
    })

    setIsEditorOpen(false)
    setEditingCourse(null)
  }

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border-color rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-base sm:text-lg font-bold text-text-primary">
              Academic Courses & Programs
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-accent text-brand-primary border border-brand-primary/20">
              {courses.length} Programs Added
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Manage degree programs, seat intakes, specialized fee structures, eligibility criteria, and branches.
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={handleAddNew}
            className="btn btn-primary btn-md text-xs cursor-pointer flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Course</span>
          </button>
        )}
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white border-2 border-dashed border-border-color rounded-xl space-y-3">
          <GraduationCap className="h-10 w-10 text-brand-primary mx-auto opacity-70" />
          <h3 className="font-serif text-base font-bold text-text-primary">
            No Academic Programs Added Yet
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Click the button below to add your institution’s first undergraduate or postgraduate course.
          </p>
          {!isReadOnly && (
            <button
              type="button"
              onClick={handleAddNew}
              className="btn btn-primary btn-sm text-xs cursor-pointer mt-2"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Course</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course, idx) => (
            <div
              key={course.id || idx}
              className="bg-white border border-border-color rounded-xl p-5 hover:border-brand-primary/40 transition-colors space-y-3 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-accent px-2 py-0.5 rounded">
                    {course.degreeLevel || 'Undergraduate'}
                  </span>
                  <h3 className="font-serif text-base font-bold text-text-primary mt-1">
                    {course.name}
                  </h3>
                </div>

                {!isReadOnly && (
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(course)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center gap-1"
                      title="Duplicate program"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline text-[11px]">Clone</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(course)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center gap-1"
                      title="Edit program"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline text-[11px]">Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(course)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-xs flex items-center gap-1"
                      title="Delete program"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Course Key Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border-color text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-text-light uppercase block">Total Fees</span>
                  <span className="font-bold text-text-primary">{course.fee || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-text-light uppercase block">Duration</span>
                  <span className="font-semibold text-text-primary">{course.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-text-light uppercase block">Seat Intake</span>
                  <span className="font-semibold text-text-primary">{course.seatIntake} Seats</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-text-light uppercase block">Avg Package</span>
                  <span className="font-bold text-emerald-600">{course.avgSalary || 'N/A'}</span>
                </div>
              </div>

              {/* Eligibility */}
              <p className="text-xs text-text-secondary">
                <strong className="text-text-primary">Eligibility: </strong>
                {course.eligibility}
              </p>

              {/* Specializations Tag List */}
              {course.specializations && course.specializations.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-text-light">Specializations:</span>
                  {course.specializations.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] font-medium bg-slate-100 text-text-primary px-2 py-0.5 rounded border border-border-color"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Course Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsEditorOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl border border-border-color shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto custom-scrollbar z-10 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border-color">
              <h3 className="font-serif text-lg font-bold text-text-primary">
                {editingCourse ? 'Edit Academic Program' : 'Add New Academic Program'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-text-light hover:text-text-primary cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <FormField
                label="Full Program / Course Name"
                required
                error={errors.name}
                helperText="e.g. B.Tech in Computer Science & Engineering"
              >
                <TextInput
                  value={courseFormData.name}
                  onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
                  placeholder="e.g. B.Tech in Computer Science & Engineering"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Degree Level / Classification" required error={errors.degreeLevel}>
                  <SelectInput
                    value={courseFormData.degreeLevel}
                    onChange={(e) => setCourseFormData({ ...courseFormData, degreeLevel: e.target.value })}
                    options={DEGREE_LEVEL_OPTIONS}
                  />
                </FormField>

                <FormField label="Duration" required error={errors.duration} helperText="e.g. 4 Years (8 Semesters)">
                  <TextInput
                    value={courseFormData.duration}
                    onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                    placeholder="e.g. 4 Years (8 Semesters)"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Total Course Fee" required error={errors.fee} helperText="e.g. ₹8.94 Lakhs">
                  <TextInput
                    value={courseFormData.fee}
                    onChange={(e) => setCourseFormData({ ...courseFormData, fee: e.target.value })}
                    placeholder="₹8.94 Lakhs"
                  />
                </FormField>

                <FormField label="Annual Tuition Fee" helperText="e.g. ₹2.24 Lakhs/Yr">
                  <TextInput
                    value={courseFormData.annualFee}
                    onChange={(e) => setCourseFormData({ ...courseFormData, annualFee: e.target.value })}
                    placeholder="₹2.24 Lakhs/Yr"
                  />
                </FormField>

                <FormField label="Approved Seat Intake" required error={errors.seatIntake} helperText="Total seats">
                  <TextInput
                    type="number"
                    value={courseFormData.seatIntake}
                    onChange={(e) => setCourseFormData({ ...courseFormData, seatIntake: parseInt(e.target.value, 10) || 0 })}
                    placeholder="124"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Course Avg Salary (Placement)" helperText="e.g. ₹32.5 LPA">
                  <TextInput
                    value={courseFormData.avgSalary}
                    onChange={(e) => setCourseFormData({ ...courseFormData, avgSalary: e.target.value })}
                    placeholder="₹32.5 LPA"
                  />
                </FormField>

                <FormField label="Course Highest Package" helperText="e.g. ₹1.50 Cr PA">
                  <TextInput
                    value={courseFormData.highestSalary}
                    onChange={(e) => setCourseFormData({ ...courseFormData, highestSalary: e.target.value })}
                    placeholder="₹1.50 Cr PA"
                  />
                </FormField>
              </div>

              <FormField
                label="Eligibility Criteria"
                required
                error={errors.eligibility}
                helperText="Prerequisite educational qualifications and minimum marks required."
              >
                <Textarea
                  rows={2}
                  value={courseFormData.eligibility}
                  onChange={(e) => setCourseFormData({ ...courseFormData, eligibility: e.target.value })}
                  placeholder="e.g. 10+2 with Physics, Chemistry, Math (min 75%) + Top Rank in JEE Advanced"
                />
              </FormField>

              <FormField
                label="Specializations / Branches (Add Multiple)"
                helperText="Type branch/specialization name and press Enter."
              >
                <TagInput
                  tags={courseFormData.specializations || []}
                  onChange={(tags) => setCourseFormData({ ...courseFormData, specializations: tags })}
                  placeholder="e.g. Artificial Intelligence, VLSI, Cybersecurity..."
                />
              </FormField>

              <FormField
                label="Career Outcomes & Job Roles"
                helperText="e.g. Software Engineer, AI Scientist, Systems Architect"
              >
                <TagInput
                  tags={courseFormData.careerOutcomes || []}
                  onChange={(tags) => setCourseFormData({ ...courseFormData, careerOutcomes: tags })}
                  placeholder="e.g. Software Development Engineer, Quantitative Analyst..."
                />
              </FormField>

              <FormField label="Course Curriculum Overview" optional>
                <Textarea
                  rows={3}
                  value={courseFormData.overview}
                  onChange={(e) => setCourseFormData({ ...courseFormData, overview: e.target.value })}
                  placeholder="Brief synopsis of core topics, laboratory work, and project electives..."
                />
              </FormField>

              <FormField label="Admission Process for this Course" optional>
                <TextInput
                  value={courseFormData.admissionProcess}
                  onChange={(e) => setCourseFormData({ ...courseFormData, admissionProcess: e.target.value })}
                  placeholder="e.g. JoSAA Centralized Counseling based on JEE Advanced AIR"
                />
              </FormField>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="btn btn-outline btn-md text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-md text-xs cursor-pointer font-bold"
                >
                  {editingCourse ? 'Update Course' : 'Save & Add Course'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Academic Program"
        message={`Are you sure you want to remove "${courseToDelete?.name}" from your college profile?`}
        confirmText="Delete Program"
        type="danger"
      />
    </div>
  )
}

export default Step3CoursesFees
