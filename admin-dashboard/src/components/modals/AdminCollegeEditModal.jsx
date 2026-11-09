import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Save,
  Building2,
  MapPin,
  BookOpen,
  Compass,
  Award,
  TrendingUp,
  Sparkles,
  Image as ImageIcon,
  Star,
  ShieldCheck,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Home,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Edit2,
} from 'lucide-react'
import AdminStatusBadge from '../common/AdminStatusBadge'
import AdminImageUploader from '../common/AdminImageUploader'

export const AdminCollegeEditModal = ({
  isOpen,
  college,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState('facilities') // Default to facilities / cost model as requested
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Sub-items temporary add states
  const [newAmenityInput, setNewAmenityInput] = useState('')
  const [newGalleryPhotoUrl, setNewGalleryPhotoUrl] = useState('')

  // Course Add State
  const [newCourse, setNewCourse] = useState({
    name: '',
    degreeLevel: 'Undergraduate (B.Tech)',
    duration: '4 Years',
    fee: '₹2.5 Lakhs/year',
    seatIntake: 120,
    avgSalary: '₹18.5 LPA',
    eligibility: '10+2 with 75% aggregate in PCM + Entrance Qualification',
  })
  const [showAddCourse, setShowAddCourse] = useState(false)

  // Cutoff Add State
  const [newCutoff, setNewCutoff] = useState({
    exam: 'JEE Advanced',
    course: 'Computer Science and Engineering',
    generalCutoff: 'AIR 1 - 250',
    obcCutoff: 'AIR 150 - 650',
    scCutoff: 'AIR 400 - 1500',
    stCutoff: 'AIR 600 - 2200',
    round: 'Round 6',
    year: 2025,
  })
  const [showAddCutoff, setShowAddCutoff] = useState(false)

  // Additional Ranking Add State
  const [newRanking, setNewRanking] = useState({
    agency: 'QS World University Rankings',
    rank: '#149 Global',
    category: 'Overall',
    year: '2025',
  })
  const [showAddRanking, setShowAddRanking] = useState(false)

  // Admission Step Add State
  const [newStep, setNewStep] = useState({
    title: '',
    desc: '',
  })
  const [showAddStep, setShowAddStep] = useState(false)

  // Master Form Data State
  const [formData, setFormData] = useState({
    // Step 1: Basic
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
    seats: '',
    tagsStr: '',

    // Step 2: Location & Contact
    address: '',
    city: '',
    state: '',
    pincode: '',
    websiteUrl: '',
    admissionEmail: '',
    helplineNumber: '',
    alternatePhone: '',
    mapCoordinates: '',

    // Step 3: Courses Offered
    coursesOffered: [],

    // Step 4: Admissions
    admissionStatus: 'Admissions Open',
    academicYear: '2026 - 2027',
    applicationStartDate: '',
    applicationEndDate: '',
    admissionPortalUrl: '',
    examAcceptedStr: '',
    admissionOverview: '',
    admissionProcessSteps: [],

    // Step 5: Cutoffs
    admissionCutoffs: [],

    // Step 6: Placements
    avgPackage: '',
    highestPackage: '',
    highestInternational: '',
    medianSalary: '',
    placementPercent: 95,
    topRecruitersStr: '',
    placementReportUrl: '',

    // Step 7: Rankings
    nirfRank: 1,
    nirfCategory: 'Overall',
    nirfYear: 2025,
    naacGrade: 'A++',
    naacCgpa: '3.88',
    additionalRankings: [],

    // Step 8: Facilities, Hostels & 4-Yr Costs
    facilities: [],
    totalHostels: '',
    totalCapacity: '',
    messFoodType: '',
    annualHostelMessFee: '',
    boysHostelDetails: '',
    girlsHostelDetails: '',
    tuitionFeePerYear: 200000,
    hostelRentYearly: 35000,
    messChargesYearly: 45000,
    cautionDepositOneTime: 15000,
    examinationMiscYearly: 10000,
    costNotes: '',

    // Step 9: Media & Gallery
    gallery: [],
    virtualTourUrl: '',

    // Step 10: Verdict & Reputation
    rating: 4.8,
    reviewsCount: 150,
    prosStr: '',
    consStr: '',
    profileStatus: 'published',
  })

  // Helper to safely parse numeric cost
  const parseNum = (val, fallback = 0) => {
    if (typeof val === 'number') return isNaN(val) ? fallback : val
    if (!val) return fallback
    const num = parseFloat(String(val).replace(/[^0-9.]/g, ''))
    return isNaN(num) ? fallback : num
  }

  // Populate formData whenever college prop changes
  useEffect(() => {
    if (college) {
      const exams = Array.isArray(college.examAccepted) && college.examAccepted.length > 0
        ? college.examAccepted
        : (Array.isArray(college.admissions?.examAccepted) ? college.admissions.examAccepted : [])

      const recruiters = Array.isArray(college.placements?.topRecruiters)
        ? college.placements.topRecruiters
        : []

      const facs = Array.isArray(college.facilities) ? [...college.facilities] : []
      const pros = Array.isArray(college.prosAndCons?.pros) ? college.prosAndCons.pros : []
      const cons = Array.isArray(college.prosAndCons?.cons) ? college.prosAndCons.cons : []
      const galleryList = Array.isArray(college.gallery) ? [...college.gallery] : []
      const coursesList = Array.isArray(college.coursesOffered) ? JSON.parse(JSON.stringify(college.coursesOffered)) : []
      const cutoffsList = Array.isArray(college.admissionCutoffs) ? JSON.parse(JSON.stringify(college.admissionCutoffs)) : []

      const stepsList = Array.isArray(college.admissionProcessSteps) && college.admissionProcessSteps.length > 0
        ? JSON.parse(JSON.stringify(college.admissionProcessSteps))
        : (Array.isArray(college.admissions?.admissionSteps)
            ? college.admissions.admissionSteps.map((s, idx) =>
                typeof s === 'string'
                  ? { step: `${idx + 1}`, title: s.split(':')[0] || `Step ${idx + 1}`, desc: s.split(':').slice(1).join(':').trim() || s }
                  : s
              )
            : [])

      const addlRankings = (
        Array.isArray(college.additionalRankings) && college.additionalRankings.length > 0
          ? college.additionalRankings
          : (Array.isArray(college.rankings?.otherRankings) ? college.rankings.otherRankings : [])
      ).map((r, idx) => {
        if (typeof r === 'string') {
          const parts = r.split(':')
          return {
            id: `rank_${idx}`,
            agency: parts[0]?.trim() || r,
            rank: parts.slice(1).join(':').trim() || '#1',
            category: 'General',
            year: '2025',
          }
        }
        return {
          id: r?.id || `rank_${idx}`,
          agency: r?.agency || r?.name || 'Ranking Agency',
          rank: r?.rank || '#1',
          category: r?.category || 'General',
          year: r?.year || '2025',
        }
      })

      const tags = Array.isArray(college.tags) ? college.tags : []
      const hostel = college.hostelDetails || {}
      const costs = college.hiddenCosts || {}

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
        seats: college.seats || '',
        tagsStr: tags.join(', '),

        // Location & Contact
        address: college.locationContact?.address || college.address || '',
        city: college.locationContact?.city || college.city || '',
        state: college.locationContact?.state || college.state || '',
        pincode: college.locationContact?.pincode || college.pincode || '',
        websiteUrl: college.locationContact?.websiteUrl || college.website || '',
        admissionEmail: college.locationContact?.admissionEmail || college.admissionEmail || '',
        helplineNumber: college.locationContact?.helplineNumber || college.helplinePhone || '',
        alternatePhone: college.locationContact?.alternatePhone || college.tollFreeHelpline || '',
        mapCoordinates: college.locationContact?.mapCoordinates || college.googleMapCoordinates || '',

        // Courses
        coursesOffered: coursesList,

        // Admissions
        admissionStatus: college.admissionStatus || college.admissions?.status || 'Admissions Open',
        academicYear: college.academicYear || '2026 - 2027',
        applicationStartDate: college.applicationStartDate || college.admissions?.applicationStart || '',
        applicationEndDate: college.applicationEndDate || college.admissions?.applicationEnd || '',
        admissionPortalUrl: college.admissionPortalUrl || '',
        examAcceptedStr: exams.join(', '),
        admissionOverview: college.admissionOverview || '',
        admissionProcessSteps: stepsList,

        // Cutoffs
        admissionCutoffs: cutoffsList,

        // Placements
        avgPackage: college.avgPackage || college.placements?.avgPackage || '',
        highestPackage: college.highestPackage || college.placements?.highestDomestic || '',
        highestInternational: college.placements?.highestInternational || '',
        medianSalary: college.placements?.medianSalary || '',
        placementPercent: college.placementPercent || college.placements?.placementRate || 95,
        topRecruitersStr: recruiters.join(', '),
        placementReportUrl: college.placements?.placementReportUrl || '',

        // Rankings
        nirfRank: college.rankings?.nirfRank || college.nirfRank || 1,
        nirfCategory: college.rankings?.nirfCategory || college.nirfCategory || 'Overall',
        nirfYear: college.rankings?.nirfYear || 2025,
        naacGrade: college.rankings?.naacGrade || college.naacGrade || 'A++',
        naacCgpa: college.rankings?.naacCgpa || '3.88',
        additionalRankings: addlRankings,

        // Facilities & Hostels & Costs
        facilities: facs,
        totalHostels: hostel.totalHostels || '',
        totalCapacity: hostel.totalCapacity || '',
        messFoodType: hostel.messFoodType || '',
        annualHostelMessFee: hostel.annualHostelMessFee || '',
        boysHostelDetails: hostel.boysHostelDetails || '',
        girlsHostelDetails: hostel.girlsHostelDetails || '',

        tuitionFeePerYear: costs.tuitionFeePerYear !== undefined ? costs.tuitionFeePerYear : 200000,
        hostelRentYearly: costs.hostelRentYearly !== undefined ? costs.hostelRentYearly : 35000,
        messChargesYearly: costs.messChargesYearly !== undefined ? costs.messChargesYearly : 45000,
        cautionDepositOneTime: costs.cautionDepositOneTime !== undefined ? costs.cautionDepositOneTime : 15000,
        examinationMiscYearly: costs.examinationMiscYearly !== undefined ? costs.examinationMiscYearly : 10000,
        costNotes: costs.notes || '',

        // Media
        gallery: galleryList,
        virtualTourUrl: college.virtualTourUrl || '',

        // Verdict & Reputation
        rating: college.rating || 4.8,
        reviewsCount: college.reviewsCount || 150,
        prosStr: pros.join('\n'),
        consStr: cons.join('\n'),
        profileStatus: college.profileStatus || 'published',
      })
      setErrorMsg('')
      setSuccessMsg('')
    }
  }, [college])

  // Live 4-Year Cost Model Calculations (Exact mirror of Screenshot)
  const annualTotalCost = useMemo(() => {
    const t = parseNum(formData.tuitionFeePerYear, 0)
    const h = parseNum(formData.hostelRentYearly, 0)
    const m = parseNum(formData.messChargesYearly, 0)
    const e = parseNum(formData.examinationMiscYearly, 0) * 2
    return t + h + m + e
  }, [formData.tuitionFeePerYear, formData.hostelRentYearly, formData.messChargesYearly, formData.examinationMiscYearly])

  const calculated4YrExpense = useMemo(() => {
    const caution = parseNum(formData.cautionDepositOneTime, 0)
    return ((annualTotalCost * 4 + caution) / 100000).toFixed(2)
  }, [annualTotalCost, formData.cautionDepositOneTime])

  if (!isOpen || !college) return null

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // --- Handlers for Amenities (Step 8) ---
  const handleAddAmenity = (nameToAdd) => {
    const name = (nameToAdd || newAmenityInput).trim()
    if (!name) return
    if (formData.facilities.includes(name)) {
      setNewAmenityInput('')
      return
    }
    setFormData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, name],
    }))
    setNewAmenityInput('')
  }

  const handleRemoveAmenity = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, idx) => idx !== indexToRemove),
    }))
  }

  // --- Handlers for Gallery (Step 9) ---
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

  // --- Handlers for Courses (Step 3) ---
  const handleAddCourse = () => {
    if (!newCourse.name.trim()) return
    setFormData((prev) => ({
      ...prev,
      coursesOffered: [
        ...prev.coursesOffered,
        {
          id: `crs_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          ...newCourse,
        },
      ],
    }))
    setNewCourse({
      name: '',
      degreeLevel: 'Undergraduate (B.Tech)',
      duration: '4 Years',
      fee: '₹2.5 Lakhs/year',
      seatIntake: 120,
      avgSalary: '₹18.5 LPA',
      eligibility: '10+2 with 75% aggregate in PCM + Entrance Qualification',
    })
    setShowAddCourse(false)
  }

  const handleRemoveCourse = (index) => {
    setFormData((prev) => ({
      ...prev,
      coursesOffered: prev.coursesOffered.filter((_, idx) => idx !== index),
    }))
  }

  // --- Handlers for Cutoffs (Step 5) ---
  const handleAddCutoff = () => {
    if (!newCutoff.course.trim()) return
    setFormData((prev) => ({
      ...prev,
      admissionCutoffs: [
        ...prev.admissionCutoffs,
        { ...newCutoff },
      ],
    }))
    setShowAddCutoff(false)
  }

  const handleRemoveCutoff = (index) => {
    setFormData((prev) => ({
      ...prev,
      admissionCutoffs: prev.admissionCutoffs.filter((_, idx) => idx !== index),
    }))
  }

  // --- Handlers for Rankings (Step 7) ---
  const handleAddRanking = () => {
    if (!newRanking.agency.trim()) return
    setFormData((prev) => ({
      ...prev,
      additionalRankings: [
        ...prev.additionalRankings,
        { id: `rank_${Date.now()}`, ...newRanking },
      ],
    }))
    setShowAddRanking(false)
  }

  const handleRemoveRanking = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalRankings: prev.additionalRankings.filter((_, idx) => idx !== index),
    }))
  }

  // --- Submit All Updates ---
  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setIsSaving(true)

    try {
      const examAccepted = formData.examAcceptedStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const topRecruiters = formData.topRecruitersStr
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

      const tags = formData.tagsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const tCost = parseNum(formData.tuitionFeePerYear)
      const hCost = parseNum(formData.hostelRentYearly)
      const mCost = parseNum(formData.messChargesYearly)
      const cCost = parseNum(formData.cautionDepositOneTime)
      const eCost = parseNum(formData.examinationMiscYearly)

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
        seats: formData.seats,
        tags: tags.length ? tags : college.tags || [],
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

        // Courses
        coursesOffered: formData.coursesOffered,

        // Admissions & Timeline
        admissionStatus: formData.admissionStatus,
        academicYear: formData.academicYear,
        applicationStartDate: formData.applicationStartDate,
        applicationEndDate: formData.applicationEndDate,
        admissionPortalUrl: formData.admissionPortalUrl,
        examAccepted,
        admissionOverview: formData.admissionOverview,
        admissionProcessSteps: formData.admissionProcessSteps,
        admissions: {
          ...(college.admissions || {}),
          status: formData.admissionStatus,
          academicYear: formData.academicYear,
          applicationStart: formData.applicationStartDate,
          applicationEnd: formData.applicationEndDate,
          examAccepted,
          overview: formData.admissionOverview,
          admissionSteps: formData.admissionProcessSteps,
        },

        // Cutoffs
        admissionCutoffs: formData.admissionCutoffs,

        // Placements
        avgPackage: formData.avgPackage,
        highestPackage: formData.highestPackage,
        placementPercent: Number(formData.placementPercent) || 90,
        placements: {
          ...(college.placements || {}),
          avgPackage: formData.avgPackage,
          highestDomestic: formData.highestPackage,
          highestInternational: formData.highestInternational,
          medianSalary: formData.medianSalary,
          placementRate: Number(formData.placementPercent) || 90,
          topRecruiters,
          placementReportUrl: formData.placementReportUrl,
        },

        // Rankings
        nirfRank: Number(formData.nirfRank) || 1,
        nirfCategory: formData.nirfCategory,
        naacGrade: formData.naacGrade,
        rankings: {
          ...(college.rankings || {}),
          nirfRank: Number(formData.nirfRank) || 1,
          nirfCategory: formData.nirfCategory,
          nirfYear: Number(formData.nirfYear) || 2025,
          naacGrade: formData.naacGrade,
          naacCgpa: formData.naacCgpa,
          otherRankings: formData.additionalRankings,
        },
        additionalRankings: formData.additionalRankings,

        // Step 8: Facilities, Hostels, & 4-Year Cost Model
        facilities: formData.facilities,
        hostelDetails: {
          totalHostels: formData.totalHostels,
          totalCapacity: formData.totalCapacity,
          messFoodType: formData.messFoodType,
          annualHostelMessFee: formData.annualHostelMessFee,
          boysHostelDetails: formData.boysHostelDetails,
          girlsHostelDetails: formData.girlsHostelDetails,
        },
        hiddenCosts: {
          tuitionFeePerYear: tCost,
          hostelRentYearly: hCost,
          messChargesYearly: mCost,
          cautionDepositOneTime: cCost,
          examinationMiscYearly: eCost,
          estimatedTotal4Yr: `₹${calculated4YrExpense} Lakhs (4 Years)`,
          notes: formData.costNotes,
        },

        // Media & Gallery
        gallery: Array.isArray(formData.gallery) ? formData.gallery : [],
        virtualTourUrl: formData.virtualTourUrl,

        // Verdict & Reputation
        rating: Number(formData.rating) || 4.8,
        reviewsCount: Number(formData.reviewsCount) || 100,
        prosAndCons: {
          pros,
          cons,
        },
      }

      const collegeId = college.id || college.slug || college._id
      await onSave(collegeId, payload)
      setSuccessMsg('College details updated successfully! Live across VidyaScope.')
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      console.error('Save college error:', err)
      setErrorMsg(err.message || 'Failed to update college details.')
    } finally {
      setIsSaving(false)
    }
  }

  // 10 Comprehensive Steps Tabs
  const tabs = [
    { id: 'basic', number: '01', label: 'Basic Info', icon: Building2 },
    { id: 'contact', number: '02', label: 'Contacts', icon: MapPin },
    { id: 'courses', number: '03', label: 'Courses & Fees', icon: BookOpen },
    { id: 'admissions', number: '04', label: 'Admissions', icon: Compass },
    { id: 'cutoffs', number: '05', label: 'Cutoffs', icon: Award },
    { id: 'placements', number: '06', label: 'Placements', icon: TrendingUp },
    { id: 'rankings', number: '07', label: 'Rankings', icon: ShieldCheck },
    { id: 'facilities', number: '08', label: 'Facilities & ROI Costs', icon: Sparkles }, // Active & highlighted
    { id: 'gallery', number: '09', label: 'Gallery', icon: ImageIcon },
    { id: 'verdict', number: '10', label: 'Verdict & Status', icon: Star },
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white w-full max-w-5xl max-h-[92vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
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
                  ID: <span className="font-mono text-slate-700">{college.slug || college.id || college._id}</span> • Full 10-Step Institutional Profile Editor
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#033C8D] hover:bg-[#022B66] shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save All Changes</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 10 Navigation Tabs Bar */}
          <div className="px-4 pt-2.5 pb-2 border-b border-slate-200 bg-slate-50/80 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
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
                    <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {tab.number}
                    </span>
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notification Alerts */}
          {errorMsg && (
            <div className="mx-5 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mx-5 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Modal Body Container */}
          <div className="p-5 overflow-y-auto flex-1 space-y-5">

            {/* ============================================================== */}
            {/* STEP 8: FACILITIES, HOSTEL AMENITIES & 4-YEAR COST MODEL       */}
            {/* ============================================================== */}
            {activeTab === 'facilities' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#033C8D]" />
                      <span>Step 8: Campus Facilities, Hostel Amenities & 4-Year Cost Model</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure verified campus amenities, hostel accommodation infrastructure, and transparent cost model.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step 8 of 10</span>
                </div>

                {/* 1. VERIFIED CAMPUS AMENITIES */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Verified Campus Amenities ({formData.facilities.length})</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">Click × to remove, or add custom below</span>
                  </div>

                  {/* Active Amenities Badges */}
                  <div className="flex flex-wrap gap-2">
                    {formData.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{fac}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(idx)}
                          className="ml-1 text-emerald-600 hover:text-rose-600 hover:bg-rose-50 p-0.5 rounded transition-colors cursor-pointer"
                          title="Remove amenity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {formData.facilities.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No campus amenities added yet.</p>
                    )}
                  </div>

                  {/* Add New Amenity Input & Quick Pills */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAmenityInput}
                        onChange={(e) => setNewAmenityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddAmenity()
                          }
                        }}
                        placeholder="Type new campus amenity (e.g. 500+ Bedded Tertiary Care Multispecialty Hospital)"
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddAmenity()}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Amenity</span>
                      </button>
                    </div>

                    {/* Quick suggestion pills */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-400">Quick Add:</span>
                      {[
                        'Central Library & Digital Research Terminal',
                        'Olympic Sports Complex & Turf',
                        'Comprehensive Hostels with Subsidized Mess',
                        'High-Speed Wi-Fi Campus',
                        'Advanced Supercomputing Research Lab',
                        '24x7 Emergency Trauma Center',
                        'Auditorium & Incubation Center',
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleAddAmenity(item)}
                          disabled={formData.facilities.includes(item)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-40"
                        >
                          + {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. HOSTEL ACCOMMODATION INFRASTRUCTURE */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Home className="h-4 w-4 text-purple-600" />
                    <span>Hostel Accommodation Infrastructure</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                      <label className="text-slate-500 text-[10px] uppercase font-bold block">
                        Total Hostels
                      </label>
                      <input
                        type="text"
                        value={formData.totalHostels}
                        onChange={(e) => handleChange('totalHostels', e.target.value)}
                        placeholder="e.g. 17 Halls of Residence"
                        className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 font-bold text-slate-900 focus:border-[#033C8D] outline-none"
                      />
                    </div>

                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                      <label className="text-slate-500 text-[10px] uppercase font-bold block">
                        Total Capacity
                      </label>
                      <input
                        type="text"
                        value={formData.totalCapacity}
                        onChange={(e) => handleChange('totalCapacity', e.target.value)}
                        placeholder="e.g. 10,000+ Students"
                        className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 font-bold text-slate-900 focus:border-[#033C8D] outline-none"
                      />
                    </div>

                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                      <label className="text-slate-500 text-[10px] uppercase font-bold block">
                        Mess Food Type
                      </label>
                      <input
                        type="text"
                        value={formData.messFoodType}
                        onChange={(e) => handleChange('messFoodType', e.target.value)}
                        placeholder="e.g. Veg & Non-Veg Multi-Cuisine"
                        className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 font-bold text-slate-900 focus:border-[#033C8D] outline-none"
                      />
                    </div>

                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                      <label className="text-slate-500 text-[10px] uppercase font-bold block">
                        Annual Hostel + Mess Fee
                      </label>
                      <input
                        type="text"
                        value={formData.annualHostelMessFee}
                        onChange={(e) => handleChange('annualHostelMessFee', e.target.value)}
                        placeholder="e.g. ₹85,000 / Year"
                        className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 font-bold text-emerald-700 focus:border-[#033C8D] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. 4-YEAR TRUE COST OF EDUCATION MODEL */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span>4-Year True Cost of Education Model</span>
                    </h4>
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200 shadow-2xs">
                      Total ~₹{calculated4YrExpense} Lakhs (4 Years)
                    </span>
                  </div>

                  {/* Input Fields for Numerical Costs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/80">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Tuition Fee (₹ / year) *
                      </label>
                      <input
                        type="number"
                        value={formData.tuitionFeePerYear}
                        onChange={(e) => handleChange('tuitionFeePerYear', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 focus:border-[#033C8D] outline-none bg-white text-[#033C8D]"
                        placeholder="1350"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Hostel Room Rent (₹ / year) *
                      </label>
                      <input
                        type="number"
                        value={formData.hostelRentYearly}
                        onChange={(e) => handleChange('hostelRentYearly', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 focus:border-[#033C8D] outline-none bg-white text-slate-800"
                        placeholder="2400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Mess / Dining Charges (₹ / year) *
                      </label>
                      <input
                        type="number"
                        value={formData.messChargesYearly}
                        onChange={(e) => handleChange('messChargesYearly', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 focus:border-[#033C8D] outline-none bg-white text-slate-800"
                        placeholder="30000"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Caution Deposit (₹ / one-time) *
                      </label>
                      <input
                        type="number"
                        value={formData.cautionDepositOneTime}
                        onChange={(e) => handleChange('cautionDepositOneTime', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 focus:border-[#033C8D] outline-none bg-white text-slate-800"
                        placeholder="500"
                      />
                    </div>
                  </div>

                  {/* Live WYSIWYG Impact Table (Exact match to screenshot table!) */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Live 4-Year Breakdown Preview
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Updates automatically from above inputs
                      </span>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                        <tr>
                          <th className="py-2.5 px-4">Fee Component</th>
                          <th className="py-2.5 px-4">Frequency</th>
                          <th className="py-2.5 px-4">Amount (₹)</th>
                          <th className="py-2.5 px-4">4-Year Total Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2.5 px-4 font-bold text-slate-900">Tuition Fee</td>
                          <td className="py-2.5 px-4 text-slate-500">Per Academic Year</td>
                          <td className="py-2.5 px-4 font-bold text-[#033C8D]">
                            ₹{parseNum(formData.tuitionFeePerYear, 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">
                            ₹{((parseNum(formData.tuitionFeePerYear, 0) * 4) / 100000).toFixed(2)} L
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-bold text-slate-900">Hostel Room Rent</td>
                          <td className="py-2.5 px-4 text-slate-500">Per Academic Year</td>
                          <td className="py-2.5 px-4 font-bold text-slate-700">
                            ₹{parseNum(formData.hostelRentYearly, 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">
                            ₹{((parseNum(formData.hostelRentYearly, 0) * 4) / 100000).toFixed(2)} L
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-bold text-slate-900">Mess / Dining Charges</td>
                          <td className="py-2.5 px-4 text-slate-500">Per Academic Year</td>
                          <td className="py-2.5 px-4 font-bold text-slate-700">
                            ₹{parseNum(formData.messChargesYearly, 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">
                            ₹{((parseNum(formData.messChargesYearly, 0) * 4) / 100000).toFixed(2)} L
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-bold text-slate-900">One-Time Caution Deposit</td>
                          <td className="py-2.5 px-4 text-slate-500">One-Time (Refundable)</td>
                          <td className="py-2.5 px-4 font-bold text-slate-700">
                            ₹{parseNum(formData.cautionDepositOneTime, 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">
                            ₹{(parseNum(formData.cautionDepositOneTime, 0) / 100000).toFixed(2)} L
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 1: BASIC INFO & LEGAL IDENTITY                           */}
            {/* ============================================================== */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#033C8D]" />
                      <span>Step 1: Basic Information & Legal Identity</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Core institutional identification, official acronyms, ownership structure, and legal affiliations.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step 1 of 10</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full College Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. All India Institute of Medical Sciences, New Delhi"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Name / Acronym *
                    </label>
                    <input
                      type="text"
                      value={formData.shortName}
                      onChange={(e) => handleChange('shortName', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. AIIMS Delhi / IIT Bombay"
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
                      <option value="medical">Medical & Healthcare</option>
                      <option value="management">Management & Business (MBA/BBA)</option>
                      <option value="law">Law & Legal Studies</option>
                      <option value="science">Pure Sciences</option>
                      <option value="arts">Humanities & Arts</option>
                      <option value="commerce">Commerce & Finance</option>
                      <option value="general">Comprehensive / General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ownership Type *
                    </label>
                    <select
                      value={formData.ownership}
                      onChange={(e) => handleChange('ownership', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none bg-white font-medium"
                    >
                      <option value="Government">Government / Public</option>
                      <option value="Autonomous">Autonomous Institute</option>
                      <option value="Private">Private University</option>
                      <option value="Deemed">Deemed to be University</option>
                      <option value="Private-Aided">Private Aided / Trust</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Establishment Year *
                    </label>
                    <input
                      type="number"
                      value={formData.establishmentYear}
                      onChange={(e) => handleChange('establishmentYear', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="1958"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Campus Area (Acres)
                    </label>
                    <input
                      type="text"
                      value={formData.campusArea}
                      onChange={(e) => handleChange('campusArea', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. 115 Acres"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Affiliation / Approvals
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
                      Accreditation Summary
                    </label>
                    <input
                      type="text"
                      value={formData.accreditation}
                      onChange={(e) => handleChange('accreditation', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. Institute of National Importance, MoHFW, UGC Approved"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Institutional Description & Overview
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="Provide comprehensive summary of the institute, research achievements, campus life, and legacy."
                    />
                  </div>

                  <div>
                    <AdminImageUploader
                      label="College Crest / Logo"
                      value={formData.logo}
                      onChange={(val) => handleChange('logo', val)}
                      aspectRatio="square"
                      helperText="Paste URL or upload PNG/JPG logo"
                    />
                  </div>

                  <div>
                    <AdminImageUploader
                      label="Main Campus Banner Image"
                      value={formData.image}
                      onChange={(val) => handleChange('image', val)}
                      aspectRatio="banner"
                      helperText="Paste URL or upload 16:9 campus hero banner"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 2: LOCATION & OFFICIAL CONTACTS                           */}
            {/* ============================================================== */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#033C8D]" />
                      <span>Step 2: Location & Communication Channels</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Official address, geographic coordinates, and validated contact points for prospective students.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step 2 of 10</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Campus Physical Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="e.g. Sri Aurobindo Marg, Ansari Nagar, Ansari Nagar East"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="New Delhi"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State / UT *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="Delhi"
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
                      placeholder="110029"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Admission Email *
                    </label>
                    <input
                      type="email"
                      value={formData.admissionEmail}
                      onChange={(e) => handleChange('admissionEmail', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="admissions@aiims.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Helpline Phone *
                    </label>
                    <input
                      type="text"
                      value={formData.helplineNumber}
                      onChange={(e) => handleChange('helplineNumber', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="011-26588500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alternate / Toll-Free Number
                    </label>
                    <input
                      type="text"
                      value={formData.alternatePhone}
                      onChange={(e) => handleChange('alternatePhone', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="011-26594832"
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
                      placeholder="https://www.aiims.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Google Maps Coordinates / Embed
                    </label>
                    <input
                      type="text"
                      value={formData.mapCoordinates}
                      onChange={(e) => handleChange('mapCoordinates', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] focus:ring-1 focus:ring-[#033C8D] outline-none"
                      placeholder="28.5672° N, 77.2100° E"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 3: ACADEMIC PROGRAMS & FEES                               */}
            {/* ============================================================== */}
            {activeTab === 'courses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#033C8D]" />
                      <span>Step 3: Academic Programs & Dynamic Fee Structures</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add, edit, or remove degree programs, annual tuition fees, seat intake, and eligibility criteria.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddCourse(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#033C8D] hover:bg-[#022B66] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add New Course</span>
                  </button>
                </div>

                {/* Add New Course Modal Form */}
                {showAddCourse && (
                  <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-[#033C8D] flex items-center justify-between">
                      <span>Add New Academic Program</span>
                      <button
                        type="button"
                        onClick={() => setShowAddCourse(false)}
                        className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Course Name *</label>
                        <input
                          type="text"
                          value={newCourse.name}
                          onChange={(e) => setNewCourse((c) => ({ ...c, name: e.target.value }))}
                          placeholder="e.g. MBBS / B.Tech Computer Science"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Degree Level</label>
                        <input
                          type="text"
                          value={newCourse.degreeLevel}
                          onChange={(e) => setNewCourse((c) => ({ ...c, degreeLevel: e.target.value }))}
                          placeholder="Undergraduate (UG)"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Duration</label>
                        <input
                          type="text"
                          value={newCourse.duration}
                          onChange={(e) => setNewCourse((c) => ({ ...c, duration: e.target.value }))}
                          placeholder="5.5 Years"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Annual Fee (₹)</label>
                        <input
                          type="text"
                          value={newCourse.fee}
                          onChange={(e) => setNewCourse((c) => ({ ...c, fee: e.target.value }))}
                          placeholder="₹1,350/year"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none font-bold text-emerald-700"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Seat Intake</label>
                        <input
                          type="number"
                          value={newCourse.seatIntake}
                          onChange={(e) => setNewCourse((c) => ({ ...c, seatIntake: e.target.value }))}
                          placeholder="125"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Average Salary Package</label>
                        <input
                          type="text"
                          value={newCourse.avgSalary}
                          onChange={(e) => setNewCourse((c) => ({ ...c, avgSalary: e.target.value }))}
                          placeholder="₹18.0 LPA"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Eligibility Criteria</label>
                        <input
                          type="text"
                          value={newCourse.eligibility}
                          onChange={(e) => setNewCourse((c) => ({ ...c, eligibility: e.target.value }))}
                          placeholder="10+2 with PCB + NEET UG Qualification"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddCourse}
                        className="px-4 py-1.5 bg-[#033C8D] text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Confirm Add Course
                      </button>
                    </div>
                  </div>
                )}

                {/* Courses List */}
                <div className="space-y-2.5">
                  {formData.coursesOffered.map((crs, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{crs.name}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                            {crs.degreeLevel || 'UG'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                            {crs.duration || '4 Years'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          Seats: <strong className="text-slate-700">{crs.seatIntake || 'N/A'}</strong> • Annual Fee: <strong className="text-emerald-700">{crs.fee || 'N/A'}</strong> • Avg CTC: <strong className="text-[#033C8D]">{crs.avgSalary || 'N/A'}</strong>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Remove Course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {formData.coursesOffered.length === 0 && (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                      <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-semibold">No Academic Programs Added Yet</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Click "Add New Course" above to list degrees and seat details.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 4: ADMISSIONS & TIMELINE                                  */}
            {/* ============================================================== */}
            {activeTab === 'admissions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Compass className="h-4 w-4 text-[#033C8D]" />
                      <span>Step 4: Admissions, Timelines & Entrance Exams</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Admission cycle status, accepted examination badges, counseling links, and process steps.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step 4 of 10</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admissions Status *
                    </label>
                    <select
                      value={formData.admissionStatus}
                      onChange={(e) => handleChange('admissionStatus', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none bg-white font-bold text-slate-800"
                    >
                      <option value="Admissions Open">🟢 Admissions Open</option>
                      <option value="Admissions Closing Soon">🟠 Admissions Closing Soon</option>
                      <option value="Admissions Closed">🔴 Admissions Closed</option>
                      <option value="Counseling In Progress">🟣 Counseling In Progress</option>
                      <option value="Upcoming Cycle">⚪ Upcoming Cycle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={formData.academicYear}
                      onChange={(e) => handleChange('academicYear', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="2026 - 2027"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Application Start Date
                    </label>
                    <input
                      type="text"
                      value={formData.applicationStartDate}
                      onChange={(e) => handleChange('applicationStartDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="e.g. Feb 15, 2026"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Application End / Deadline Date
                    </label>
                    <input
                      type="text"
                      value={formData.applicationEndDate}
                      onChange={(e) => handleChange('applicationEndDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="e.g. May 30, 2026"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Accepted Entrance Exams (Comma-Separated) *
                    </label>
                    <input
                      type="text"
                      value={formData.examAcceptedStr}
                      onChange={(e) => handleChange('examAcceptedStr', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none font-semibold text-purple-700"
                      placeholder="NEET UG, INI CET, AIIMS Fellowship Exam"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admission Portal / Counseling Link
                    </label>
                    <input
                      type="url"
                      value={formData.admissionPortalUrl}
                      onChange={(e) => handleChange('admissionPortalUrl', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none font-mono"
                      placeholder="https://mcc.nic.in"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admission Overview & Guidelines
                    </label>
                    <textarea
                      rows={2}
                      value={formData.admissionOverview}
                      onChange={(e) => handleChange('admissionOverview', e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="Details on merit lists, counseling rounds, category reservations, and document verification."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 5: CUTOFF RANKS MATRIX                                    */}
            {/* ============================================================== */}
            {activeTab === 'cutoffs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#033C8D]" />
                      <span>Step 5: Entrance Examination Cutoff Matrix</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Maintain closing ranks across General, OBC, SC, and ST categories for transparent student benchmarks.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddCutoff(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#033C8D] hover:bg-[#022B66] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Cutoff Row</span>
                  </button>
                </div>

                {/* Add Cutoff Inline Form */}
                {showAddCutoff && (
                  <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-purple-900 flex items-center justify-between">
                      <span>Add Cutoff Benchmark Row</span>
                      <button
                        type="button"
                        onClick={() => setShowAddCutoff(false)}
                        className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Exam *</label>
                        <input
                          type="text"
                          value={newCutoff.exam}
                          onChange={(e) => setNewCutoff((c) => ({ ...c, exam: e.target.value }))}
                          placeholder="NEET UG"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Course / Specialization *</label>
                        <input
                          type="text"
                          value={newCutoff.course}
                          onChange={(e) => setNewCutoff((c) => ({ ...c, course: e.target.value }))}
                          placeholder="MBBS"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">General Cutoff</label>
                        <input
                          type="text"
                          value={newCutoff.generalCutoff}
                          onChange={(e) => setNewCutoff((c) => ({ ...c, generalCutoff: e.target.value }))}
                          placeholder="AIR 1 - 55"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">OBC Cutoff</label>
                        <input
                          type="text"
                          value={newCutoff.obcCutoff}
                          onChange={(e) => setNewCutoff((c) => ({ ...c, obcCutoff: e.target.value }))}
                          placeholder="AIR 56 - 240"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">SC Cutoff</label>
                        <input
                          type="text"
                          value={newCutoff.scCutoff}
                          onChange={(e) => setNewCutoff((c) => ({ ...c, scCutoff: e.target.value }))}
                          placeholder="AIR 250 - 1200"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">ST Cutoff</label>
                        <input
                          type="text"
                          value={newCutoff.stCutoff}
                          onChange={(e) => setNewCutoff((c) => ({ ...c, stCutoff: e.target.value }))}
                          placeholder="AIR 1300 - 3200"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Round & Year</label>
                        <input
                          type="text"
                          value={newCutoff.round}
                          onChange={(e) => setNewCutoff((c) => ({ ...c, round: e.target.value }))}
                          placeholder="Round 1 (2025)"
                          className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddCutoff}
                        className="px-4 py-1.5 bg-purple-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Confirm Add Cutoff
                      </button>
                    </div>
                  </div>
                )}

                {/* Cutoff Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <tr>
                        <th className="py-2.5 px-4">Exam & Course</th>
                        <th className="py-2.5 px-4">General</th>
                        <th className="py-2.5 px-4">OBC</th>
                        <th className="py-2.5 px-4">SC / ST</th>
                        <th className="py-2.5 px-4">Round</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.admissionCutoffs.map((ctf, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4">
                            <span className="font-bold text-slate-900 block">{ctf.course}</span>
                            <span className="text-[10px] text-purple-700 font-semibold">{ctf.exam}</span>
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-800">{ctf.generalCutoff || 'N/A'}</td>
                          <td className="py-2.5 px-4 text-slate-600">{ctf.obcCutoff || 'N/A'}</td>
                          <td className="py-2.5 px-4 text-slate-600">{ctf.scCutoff || 'N/A'} / {ctf.stCutoff || 'N/A'}</td>
                          <td className="py-2.5 px-4 text-slate-500">{ctf.round || 'Final'}</td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveCutoff(idx)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete row"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {formData.admissionCutoffs.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-400 italic">
                            No cutoff rank records configured. Click "Add Cutoff Row" above to enter rank bounds.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 6: PLACEMENTS & RECRUITERS                                */}
            {/* ============================================================== */}
            {activeTab === 'placements' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#033C8D]" />
                      <span>Step 6: Placement Statistics & Corporate Recruiters</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Average CTC, highest offers, placement percentages, and verified recruiter roster.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step 6 of 10</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Average CTC Package *
                    </label>
                    <input
                      type="text"
                      value={formData.avgPackage}
                      onChange={(e) => handleChange('avgPackage', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold text-[#033C8D] rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="₹18.0 LPA"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Highest Domestic Package *
                    </label>
                    <input
                      type="text"
                      value={formData.highestPackage}
                      onChange={(e) => handleChange('highestPackage', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold text-slate-900 rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="₹45.0 LPA"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Highest International Offer
                    </label>
                    <input
                      type="text"
                      value={formData.highestInternational}
                      onChange={(e) => handleChange('highestInternational', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="e.g. ₹1.2 CPA"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Median Salary Package
                    </label>
                    <input
                      type="text"
                      value={formData.medianSalary}
                      onChange={(e) => handleChange('medianSalary', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="₹16.5 LPA"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Placement Success Rate (%) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.placementPercent}
                      onChange={(e) => handleChange('placementPercent', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold text-emerald-700 rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="95"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Placement Audit Report Link
                    </label>
                    <input
                      type="url"
                      value={formData.placementReportUrl}
                      onChange={(e) => handleChange('placementReportUrl', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none font-mono"
                      placeholder="https://institute.ac.in/placement-report.pdf"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Top Corporate Recruiters (Comma-Separated) *
                    </label>
                    <textarea
                      rows={2}
                      value={formData.topRecruitersStr}
                      onChange={(e) => handleChange('topRecruitersStr', e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="Apollo Hospitals, Fortis Healthcare, Max Healthcare, WHO, Medanta, AIIMS"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 7: RANKINGS & ACCREDITATIONS                              */}
            {/* ============================================================== */}
            {activeTab === 'rankings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#033C8D]" />
                      <span>Step 7: NIRF, NAAC & Regulatory Accreditations</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      National Institutional Ranking Framework data, NAAC grading, and international benchmark recognitions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddRanking(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#033C8D] hover:bg-[#022B66] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Other Ranking</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NIRF Rank *
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.nirfRank}
                      onChange={(e) => handleChange('nirfRank', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold text-[#033C8D] rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NIRF Category *
                    </label>
                    <input
                      type="text"
                      value={formData.nirfCategory}
                      onChange={(e) => handleChange('nirfCategory', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="Medical / Engineering / Overall"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NIRF Ranking Year
                    </label>
                    <input
                      type="number"
                      value={formData.nirfYear}
                      onChange={(e) => handleChange('nirfYear', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="2025"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NAAC Grade *
                    </label>
                    <input
                      type="text"
                      value={formData.naacGrade}
                      onChange={(e) => handleChange('naacGrade', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="A++"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NAAC CGPA (out of 4.0)
                    </label>
                    <input
                      type="text"
                      value={formData.naacCgpa}
                      onChange={(e) => handleChange('naacCgpa', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="3.88"
                    />
                  </div>
                </div>

                {/* Other Agency Rankings */}
                {showAddRanking && (
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5">
                    <h4 className="text-xs font-bold text-[#033C8D] flex items-center justify-between">
                      <span>Add Ranking from Other Agency</span>
                      <button
                        type="button"
                        onClick={() => setShowAddRanking(false)}
                        className="text-slate-400 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={newRanking.agency}
                        onChange={(e) => setNewRanking((r) => ({ ...r, agency: e.target.value }))}
                        placeholder="Agency (e.g. QS World / THE)"
                        className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                      />
                      <input
                        type="text"
                        value={newRanking.rank}
                        onChange={(e) => setNewRanking((r) => ({ ...r, rank: e.target.value }))}
                        placeholder="Rank (e.g. #149 Global)"
                        className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none font-bold text-slate-900"
                      />
                      <input
                        type="text"
                        value={newRanking.category}
                        onChange={(e) => setNewRanking((r) => ({ ...r, category: e.target.value }))}
                        placeholder="Category"
                        className="px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddRanking}
                        className="px-3 py-1.5 bg-[#033C8D] text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Add Ranking
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {formData.additionalRankings.map((rk, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="h-3.5 w-3.5 text-purple-600" />
                        <span className="font-bold text-slate-900">{rk.agency}:</span>
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-extrabold text-[11px]">
                          {rk.rank}
                        </span>
                        <span className="text-slate-400 text-[10px]">({rk.year || '2025'})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRanking(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 9: MEDIA & CAMPUS GALLERY                                 */}
            {/* ============================================================== */}
            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-[#033C8D]" />
                      <span>Step 9: High-Resolution Campus Photography & Media</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload and manage campus facilities, library, hostels, medical facilities, and sports arena photography.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step 9 of 10</span>
                </div>

                {/* Add Photo Card */}
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

                {/* 360 Virtual Tour URL */}
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Campus 360° Virtual Tour / Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.virtualTourUrl}
                    onChange={(e) => handleChange('virtualTourUrl', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or Matterport embed"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono focus:border-[#033C8D] outline-none"
                  />
                </div>

                {/* Current Gallery Grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700">
                    Existing Campus Gallery Photos ({formData.gallery.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formData.gallery.map((photo, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 aspect-video shadow-2xs"
                      >
                        <img
                          src={photo}
                          alt={`Campus Photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/600x400?text=Invalid+Image'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryPhoto(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-rose-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                          title="Delete photo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 10: VERDICT, STATUS & REPUTATION                          */}
            {/* ============================================================== */}
            {activeTab === 'verdict' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#033C8D]" />
                      <span>Step 10: Verification Verdict, Publishing State & Reputation</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Editorial verification state, student satisfaction ratings, verified pros, and institutional considerations.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Step 10 of 10</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Editorial Verification & Publishing State *
                    </label>
                    <select
                      value={formData.profileStatus}
                      onChange={(e) => handleChange('profileStatus', e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none bg-white font-bold text-slate-900 shadow-2xs"
                    >
                      <option value="published">🟢 Published (Active live in student catalog & compare)</option>
                      <option value="under_review">🔵 Under Review (In Administrator audit queue)</option>
                      <option value="changes_requested">🟠 Changes Requested (Pending College revisions)</option>
                      <option value="draft">⚪ Draft (Private & hidden from student website)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Satisfaction Rating (out of 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={1}
                      max={5}
                      value={formData.rating}
                      onChange={(e) => handleChange('rating', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold text-amber-600 rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="4.8"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Verified Student Reviews Count
                    </label>
                    <input
                      type="number"
                      value={formData.reviewsCount}
                      onChange={(e) => handleChange('reviewsCount', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="150"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Institutional Advantages / Pros (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.prosStr}
                      onChange={(e) => handleChange('prosStr', e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="World-class clinical exposure & tertiary hospital&#10;Subsidized fee structure with high return on investment&#10;Unrivaled peer group and national brand reputation"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Considerations / Cons (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.consStr}
                      onChange={(e) => handleChange('consStr', e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#033C8D] outline-none"
                      placeholder="Highly competitive relative grading&#10;Demanding clinical shift timings"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-500">
              Editing: <strong className="text-slate-800">{formData.name}</strong> • Active Tab: <span className="font-semibold text-[#033C8D]">{tabs.find((t) => t.id === activeTab)?.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#033C8D] hover:bg-[#022B66] shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save All Changes</span>
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

export default AdminCollegeEditModal
