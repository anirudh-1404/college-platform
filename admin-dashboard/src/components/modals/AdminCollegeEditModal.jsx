import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Save,
  Building2,
  MapPin,
  Award,
  TrendingUp,
  Sparkles,
  Globe,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  DollarSign,
  Star,
  ShieldCheck,
  Image as ImageIcon,
  Trash2,
  Plus,
  ExternalLink,
} from 'lucide-react'
import AdminStatusBadge from '../common/AdminStatusBadge'
import AdminImageUploader from '../common/AdminImageUploader'

export const AdminCollegeEditModal = ({
  isOpen,
  college,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    stream: 'engineering',
    ownership: 'Government',
    establishmentYear: 1958,
    campusArea: '',
    affiliation: '',
    accreditation: '',
    description: '',
    logo: '',
    image: '',
    websiteUrl: '',
    // Location & Contact
    address: '',
    city: '',
    state: '',
    pincode: '',
    admissionEmail: '',
    helplineNumber: '',
    alternatePhone: '',
    mapCoordinates: '',
    // Academics & Rankings
    nirfRank: 1,
    nirfCategory: 'Overall',
    naacGrade: 'A++',
    examAcceptedStr: '',
    admissionStatus: 'Admissions Open',
    // Placements & Fees
    avgPackage: '',
    highestPackage: '',
    highestInternational: '',
    medianSalary: '',
    placementPercent: 95,
    totalFees: '',
    feesPeriod: '4 Years',
    topRecruitersStr: '',
    // Facilities & Reputation
    rating: 4.8,
    reviewsCount: 150,
    facilitiesStr: '',
    prosStr: '',
    consStr: '',
    profileStatus: 'published',
    gallery: [],
  })

  const [newGalleryPhotoUrl, setNewGalleryPhotoUrl] = useState('')

  // Populate formData whenever college prop changes
  useEffect(() => {
    if (college) {
      const exams = Array.isArray(college.examAccepted)
        ? college.examAccepted
        : (college.admissions?.examAccepted || [])

      const recruiters = Array.isArray(college.placements?.topRecruiters)
        ? college.placements.topRecruiters
        : []

      const facs = Array.isArray(college.facilities) ? college.facilities : []

      const pros = Array.isArray(college.prosAndCons?.pros) ? college.prosAndCons.pros : []
      const cons = Array.isArray(college.prosAndCons?.cons) ? college.prosAndCons.cons : []
      const galleryList = Array.isArray(college.gallery) ? college.gallery : []

      setFormData({
        name: college.name || '',
        shortName: college.shortName || '',
        stream: college.stream || 'engineering',
        ownership: college.ownership || 'Government',
        establishmentYear: college.establishmentYear || 1958,
        campusArea: college.campusArea || '',
        affiliation: college.affiliation || '',
        accreditation: college.accreditation || '',
        description: college.description || '',
        logo: college.logo || '',
        image: college.image || '',
        websiteUrl: college.locationContact?.websiteUrl || college.website || '',
        // Location & Contact
        address: college.locationContact?.address || college.address || '',
        city: college.locationContact?.city || college.city || '',
        state: college.locationContact?.state || college.state || '',
        pincode: college.locationContact?.pincode || college.pincode || '',
        admissionEmail: college.locationContact?.admissionEmail || college.admissionEmail || '',
        helplineNumber: college.locationContact?.helplineNumber || college.helplinePhone || '',
        alternatePhone: college.locationContact?.alternatePhone || college.tollFreeHelpline || '',
        mapCoordinates: college.locationContact?.mapCoordinates || college.googleMapCoordinates || '',
        // Academics & Rankings
        nirfRank: college.rankings?.nirfRank || college.nirfRank || 1,
        nirfCategory: college.rankings?.nirfCategory || college.nirfCategory || 'Overall',
        naacGrade: college.rankings?.naacGrade || college.naacGrade || 'A++',
        examAcceptedStr: exams.join(', '),
        admissionStatus: college.admissionStatus || college.admissions?.status || 'Admissions Open',
        // Placements & Fees
        avgPackage: college.avgPackage || college.placements?.avgPackage || '',
        highestPackage: college.highestPackage || college.placements?.highestDomestic || '',
        highestInternational: college.placements?.highestInternational || '',
        medianSalary: college.placements?.medianSalary || '',
        placementPercent: college.placementPercent || college.placements?.placementRate || 95,
        totalFees: college.totalFees || college.coursesOffered?.[0]?.fee || '',
        feesPeriod: college.feesPeriod || '4 Years',
        topRecruitersStr: recruiters.join(', '),
        // Facilities & Reputation
        rating: college.rating || 4.8,
        reviewsCount: college.reviewsCount || 150,
        facilitiesStr: facs.join(', '),
        prosStr: pros.join('\n'),
        consStr: cons.join('\n'),
        profileStatus: college.profileStatus || 'published',
        gallery: galleryList,
      })
      setErrorMsg('')
      setSuccessMsg('')
    }
  }, [college])

  const handleAddGalleryPhoto = (e) => {
    e?.preventDefault()
    if (!newGalleryPhotoUrl || !newGalleryPhotoUrl.trim()) return
    setFormData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), newGalleryPhotoUrl.trim()],
    }))
    setNewGalleryPhotoUrl('')
  }

  const handleRemoveGalleryPhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, idx) => idx !== index),
    }))
  }

  if (!isOpen || !college) return null

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setIsSaving(true)

    try {
      // Format arrays from comma / newline separated strings
      const examAccepted = formData.examAcceptedStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const topRecruiters = formData.topRecruitersStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const facilities = formData.facilitiesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const pros = formData.prosStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)

      const cons = formData.consStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        name: formData.name,
        shortName: formData.shortName,
        stream: formData.stream,
        ownership: formData.ownership,
        establishmentYear: Number(formData.establishmentYear) || 1958,
        campusArea: formData.campusArea,
        affiliation: formData.affiliation,
        accreditation: formData.accreditation,
        description: formData.description,
        logo: formData.logo,
        image: formData.image,
        website: formData.websiteUrl,
        profileStatus: formData.profileStatus,

        // Flat & Location contact
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        admissionEmail: formData.admissionEmail,
        helplinePhone: formData.helplineNumber,
        tollFreeHelpline: formData.alternatePhone,
        googleMapCoordinates: formData.mapCoordinates,
        locationContact: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          admissionEmail: formData.admissionEmail,
          helplineNumber: formData.helplineNumber,
          alternatePhone: formData.alternatePhone,
          websiteUrl: formData.websiteUrl,
          mapCoordinates: formData.mapCoordinates,
        },

        // Academics & Rankings
        nirfRank: Number(formData.nirfRank) || 1,
        nirfCategory: formData.nirfCategory,
        naacGrade: formData.naacGrade,
        examAccepted,
        admissionStatus: formData.admissionStatus,
        rankings: {
          ...(college.rankings || {}),
          nirfRank: Number(formData.nirfRank) || 1,
          nirfCategory: formData.nirfCategory,
          naacGrade: formData.naacGrade,
        },
        admissions: {
          ...(college.admissions || {}),
          status: formData.admissionStatus,
          examAccepted,
        },

        // Placements & Fees
        avgPackage: formData.avgPackage,
        highestPackage: formData.highestPackage,
        totalFees: formData.totalFees,
        feesPeriod: formData.feesPeriod,
        placementPercent: Number(formData.placementPercent) || 90,
        placements: {
          ...(college.placements || {}),
          avgPackage: formData.avgPackage,
          highestDomestic: formData.highestPackage,
          highestInternational: formData.highestInternational || college.placements?.highestInternational,
          medianSalary: formData.medianSalary || college.placements?.medianSalary,
          placementRate: Number(formData.placementPercent) || 90,
          topRecruiters: topRecruiters.length ? topRecruiters : college.placements?.topRecruiters || [],
        },

        // Facilities & Ratings
        rating: Number(formData.rating) || 4.8,
        reviewsCount: Number(formData.reviewsCount) || 100,
        facilities: facilities.length ? facilities : college.facilities || [],
        prosAndCons: {
          pros: pros.length ? pros : college.prosAndCons?.pros || [],
          cons: cons.length ? cons : college.prosAndCons?.cons || [],
        },
        gallery: Array.isArray(formData.gallery) ? formData.gallery : [],
      }

      const collegeId = college.id || college.slug || college._id
      await onSave(collegeId, payload)
      setSuccessMsg('College details updated successfully! Live across VidyaScope.')
      setTimeout(() => {
        onClose()
      }, 1100)
    } catch (err) {
      console.error('Save college error:', err)
      setErrorMsg(err.message || 'Failed to update college details.')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Basic & Identity', icon: Building2 },
    { id: 'contact', label: 'Location & Contacts', icon: MapPin },
    { id: 'academics', label: 'Rankings & Exams', icon: Award },
    { id: 'placements', label: 'Placements & Fees', icon: TrendingUp },
    { id: 'facilities', label: 'Facilities & Pros/Cons', icon: Sparkles },
    { id: 'gallery', label: 'Media & Campus Gallery', icon: ImageIcon },
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#033C8D] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                {formData.shortName?.slice(0, 2).toUpperCase() || 'ED'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 truncate">
                    Edit: {formData.name || college.name}
                  </h2>
                  <AdminStatusBadge status={formData.profileStatus} />
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  ID: <span className="font-mono text-slate-700">{college.slug || college.id || college._id}</span> • Changes will instantly reflect live on User Website & Listings
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="px-5 pt-2.5 pb-2 border-b border-slate-200 bg-slate-50/70 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#033C8D] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form Content Area (Scrollable) */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: BASIC & IDENTITY */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Legal College Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. Indian Institute of Technology Bombay"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Name / Acronym *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shortName}
                      onChange={(e) => handleChange('shortName', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. IIT Bombay"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Stream *
                    </label>
                    <select
                      value={formData.stream}
                      onChange={(e) => handleChange('stream', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none bg-white font-medium"
                    >
                      <option value="engineering">Engineering & Technology</option>
                      <option value="management">Management & Business (MBA/BBA)</option>
                      <option value="medical">Medical & Healthcare (MBBS/B.Sc)</option>
                      <option value="law">Law & Legal Studies</option>
                      <option value="commerce">Commerce & Finance</option>
                      <option value="arts">Arts, Humanities & Social Sciences</option>
                      <option value="science">Pure & Applied Sciences</option>
                      <option value="general">Comprehensive / General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ownership / Governance *
                    </label>
                    <select
                      value={formData.ownership}
                      onChange={(e) => handleChange('ownership', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none bg-white font-medium"
                    >
                      <option value="Government">Government / Public (IoE / Central / State)</option>
                      <option value="Private">Private / Autonomous University</option>
                      <option value="Deemed">Deemed-to-be-University</option>
                      <option value="Autonomous">Autonomous Affiliated Institute</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Establishment Year
                    </label>
                    <input
                      type="number"
                      value={formData.establishmentYear}
                      onChange={(e) => handleChange('establishmentYear', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. 1958"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Campus Area / Land Size
                    </label>
                    <input
                      type="text"
                      value={formData.campusArea}
                      onChange={(e) => handleChange('campusArea', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. 550 Acres"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Affiliation / Recognition
                    </label>
                    <input
                      type="text"
                      value={formData.affiliation}
                      onChange={(e) => handleChange('affiliation', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. Autonomous Institute of National Importance"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Website URL
                    </label>
                    <input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => handleChange('websiteUrl', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="https://www.iitb.ac.in"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <AdminImageUploader
                      label="Main Campus Banner & Card Image"
                      value={formData.image}
                      onChange={(val) => handleChange('image', val)}
                      aspectRatio="banner"
                      helperText="Displayed as wide campus banner on college detail page and primary thumbnail on search & compare cards."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <AdminImageUploader
                      label="College Official Logo (Circle Avatar)"
                      value={formData.logo}
                      onChange={(val) => handleChange('logo', val)}
                      aspectRatio="square"
                      helperText="Displayed in the circular avatar emblem next to the college title on profile and search cards."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Institutional Description & Overview
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="Provide comprehensive overview of campus history, faculties, research achievements..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LOCATION & CONTACTS */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Campus Physical Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. Main Gate Road, Powai, Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State / UT *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. Maharashtra"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. 400076"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admission Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.admissionEmail}
                      onChange={(e) => handleChange('admissionEmail', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="admissions@iitb.ac.in"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Helpline Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.helplineNumber}
                      onChange={(e) => handleChange('helplineNumber', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="+91-22-2576-7000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Toll-Free / Alternate Phone
                    </label>
                    <input
                      type="text"
                      value={formData.alternatePhone}
                      onChange={(e) => handleChange('alternatePhone', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="1800-22-2200"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Google Maps Coordinates (Lat, Lng)
                    </label>
                    <input
                      type="text"
                      value={formData.mapCoordinates}
                      onChange={(e) => handleChange('mapCoordinates', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="19.1334° N, 72.9133° E"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RANKINGS & EXAMS */}
            {activeTab === 'academics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NIRF All India Rank *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.nirfRank}
                      onChange={(e) => handleChange('nirfRank', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. 1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NIRF Category
                    </label>
                    <input
                      type="text"
                      value={formData.nirfCategory}
                      onChange={(e) => handleChange('nirfCategory', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. Engineering / Medical / Overall"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NAAC Accreditation Grade
                    </label>
                    <input
                      type="text"
                      value={formData.naacGrade}
                      onChange={(e) => handleChange('naacGrade', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. A++ (3.88 CGPA)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current Admission Status
                    </label>
                    <input
                      type="text"
                      value={formData.admissionStatus}
                      onChange={(e) => handleChange('admissionStatus', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. Admissions Open (2026–27)"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Accepted Entrance Exams (Comma-Separated)
                    </label>
                    <input
                      type="text"
                      value={formData.examAcceptedStr}
                      onChange={(e) => handleChange('examAcceptedStr', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. JEE Advanced, JEE Main, GATE, CEED"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Separate each exam with a comma. These appear as chips in Compare and Listing pages.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PLACEMENTS & FEES */}
            {activeTab === 'placements' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Average CTC Package *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.avgPackage}
                      onChange={(e) => handleChange('avgPackage', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. ₹24.5 LPA"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Highest Domestic CTC Package
                    </label>
                    <input
                      type="text"
                      value={formData.highestPackage}
                      onChange={(e) => handleChange('highestPackage', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. ₹1.50 Cr PA"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Median Placement CTC
                    </label>
                    <input
                      type="text"
                      value={formData.medianSalary}
                      onChange={(e) => handleChange('medianSalary', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. ₹20.0 LPA"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Placement Rate (% Placed)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.placementPercent}
                      onChange={(e) => handleChange('placementPercent', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. 98"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Course Tuition Fee *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.totalFees}
                      onChange={(e) => handleChange('totalFees', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. ₹8.94 Lakhs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fees Duration Period
                    </label>
                    <input
                      type="text"
                      value={formData.feesPeriod}
                      onChange={(e) => handleChange('feesPeriod', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. 4 Years / Total Course Fee"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Top Recruiting Partners (Comma-Separated)
                    </label>
                    <input
                      type="text"
                      value={formData.topRecruitersStr}
                      onChange={(e) => handleChange('topRecruitersStr', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="Google, Microsoft, Goldman Sachs, Texas Instruments, Apple"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: FACILITIES & PROS/CONS & STATUS */}
            {activeTab === 'facilities' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Rating (out of 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={1}
                      max={5}
                      value={formData.rating}
                      onChange={(e) => handleChange('rating', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. 4.9"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Verified Reviews Count
                    </label>
                    <input
                      type="number"
                      value={formData.reviewsCount}
                      onChange={(e) => handleChange('reviewsCount', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. 2450"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Campus Facilities (Comma-Separated)
                    </label>
                    <input
                      type="text"
                      value={formData.facilitiesStr}
                      onChange={(e) => handleChange('facilitiesStr', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="Hostel, Gym, Central Library, Sports Arena, High-Speed Wi-Fi, Placement Cell, Medical Center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Institutional Advantages / Pros (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.prosStr}
                      onChange={(e) => handleChange('prosStr', e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="Unrivaled tech & research labs&#10;Stellar international alumni network&#10;Top tier placement package"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Institutional Considerations / Cons (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.consStr}
                      onChange={(e) => handleChange('consStr', e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="Intense academic competition&#10;High cutoff requirement"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Editorial Publication State *
                    </label>
                    <select
                      value={formData.profileStatus}
                      onChange={(e) => handleChange('profileStatus', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none bg-white font-bold text-slate-800"
                    >
                      <option value="published">🟢 Published (Live in Student Directory & Compare)</option>
                      <option value="under_review">🔵 Under Review (In Editorial Queue)</option>
                      <option value="changes_requested">🟠 Changes Requested (Pending College Revision)</option>
                      <option value="draft">⚪ Draft (Hidden from Public)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: MEDIA & CAMPUS GALLERY */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Campus Photo Gallery & Media Assets
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage high-definition campus facilities, library, hostels, supercomputing labs, and event photography displayed on the public college detail page.
                  </p>
                </div>

                {/* Add New Photo Card with 2 options */}
                <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-[#033C8D]" />
                    <span>Add New Photo to Gallery</span>
                  </h4>
                  
                  <AdminImageUploader
                    label="Choose Photo (Option 1: Paste URL or Option 2: Upload from Device)"
                    value={newGalleryPhotoUrl}
                    onChange={(val) => setNewGalleryPhotoUrl(val)}
                    aspectRatio="banner"
                    helperText="Paste direct image URL or upload image file directly from your computer."
                  />

                  {newGalleryPhotoUrl && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddGalleryPhoto}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#033C8D] hover:bg-[#022B66] shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Photo to Gallery ({formData.gallery?.length || 0} existing)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Existing Gallery Photos */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700">
                      Existing Gallery Photos ({formData.gallery?.length || 0})
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Click trash icon on any photo to remove it
                    </span>
                  </div>

                  {formData.gallery && formData.gallery.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {formData.gallery.map((photoUrl, idx) => (
                        <div
                          key={idx}
                          className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video shadow-xs"
                        >
                          <img
                            src={photoUrl}
                            alt={`Gallery photo ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/400x250?text=Invalid+Image'
                            }}
                          />
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            <a
                              href={photoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-colors cursor-pointer"
                              title="Open original"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryPhoto(idx)}
                              className="p-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                              title="Remove from gallery"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                            #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <ImageIcon className="h-8 w-8 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-600">No gallery photos added yet</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Add campus photos using the uploader above.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>

          {/* Footer Controls */}
          <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Saved updates will sync directly to MongoDB.
            </span>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#033C8D] hover:bg-[#022B66] shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save & Update College</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
