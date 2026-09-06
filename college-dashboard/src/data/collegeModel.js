/**
 * VidyaScope College Master Data Model & Schema
 * Fully dynamic schema corresponding 1:1 with the Public User Website and Database entities.
 */

import {
  Building2,
  MapPin,
  BookOpen,
  Compass,
  Award,
  TrendingUp,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react'

export const ONBOARDING_STEPS = [
  { id: 1, number: '01', label: 'Basic Information', subtitle: 'College identity and overview', fullTitle: 'Basic Institutional Information', icon: Building2 },
  { id: 2, number: '02', label: 'Location & Contact', subtitle: 'Address and contact details', fullTitle: 'Location & Communication Channels', icon: MapPin },
  { id: 3, number: '03', label: 'Courses & Fees', subtitle: 'Add and manage courses', fullTitle: 'Academic Programs & Dynamic Fee Structures', icon: BookOpen },
  { id: 4, number: '04', label: 'Admissions', subtitle: 'Eligibility and admission process', fullTitle: 'Admissions, Eligibility & Process', icon: Compass },
  { id: 5, number: '05', label: 'Cutoffs', subtitle: 'Previous year cutoff data', fullTitle: 'Entrance Examination Cutoff Matrix', icon: Award },
  { id: 6, number: '06', label: 'Placements', subtitle: 'Placement statistics and recruiters', fullTitle: 'Placement Records & Top Recruiters', icon: TrendingUp },
  { id: 7, number: '07', label: 'Rankings & Accreditations', subtitle: 'Approvals and recognitions', fullTitle: 'NIRF, NAAC & Regulatory Accreditations', icon: Award },
  { id: 8, number: '08', label: 'Facilities', subtitle: 'Campus facilities and amenities', fullTitle: 'Campus Facilities & Hidden Cost Breakdown', icon: Sparkles },
  { id: 9, number: '09', label: 'Gallery', subtitle: 'Photos and videos', fullTitle: 'Campus & Infrastructure Media Manager', icon: ImageIcon },
  { id: 10, number: '10', label: 'Review & Submit', subtitle: 'Review and send for approval', fullTitle: 'Live Public Review & Submission for Approval', icon: CheckCircle2 },
]

export const STREAM_OPTIONS = [
  { value: 'engineering', label: 'Engineering & Technology (B.Tech/M.Tech)' },
  { value: 'management', label: 'Management & Business (MBA/BBA)' },
  { value: 'medical', label: 'Medical & Healthcare (MBBS/MD)' },
  { value: 'law', label: 'Law & Legal Studies (LLB/LLM)' },
  { value: 'science', label: 'Pure Sciences (B.Sc/M.Sc)' },
  { value: 'arts', label: 'Humanities & Arts (BA/MA)' },
]

export const OWNERSHIP_OPTIONS = [
  { value: 'Government', label: 'Government / Public (Central/State)' },
  { value: 'Autonomous', label: 'Autonomous Institute of National Importance' },
  { value: 'Private', label: 'Private University' },
  { value: 'Deemed', label: 'Deemed to be University' },
  { value: 'Private-Aided', label: 'Private Aided / Trust' },
]

export const DEGREE_LEVEL_OPTIONS = [
  { value: 'Undergraduate (B.Tech)', label: 'Undergraduate (B.Tech / B.E.)' },
  { value: 'Undergraduate (B.Sc)', label: 'Undergraduate (B.Sc / BS)' },
  { value: 'Undergraduate (BBA)', label: 'Undergraduate (BBA / BMS)' },
  { value: 'Undergraduate (MBBS)', label: 'Undergraduate (MBBS / BDS)' },
  { value: 'Postgraduate (M.Tech)', label: 'Postgraduate (M.Tech / M.E.)' },
  { value: 'Postgraduate (MBA)', label: 'Postgraduate (MBA / PGDM)' },
  { value: 'Postgraduate (M.Sc)', label: 'Postgraduate (M.Sc / MS)' },
  { value: 'Postgraduate (MD/MS)', label: 'Postgraduate (MD / MS Medical)' },
  { value: 'Doctoral (Ph.D)', label: 'Doctoral (Ph.D / Fellowship)' },
  { value: 'Diploma', label: 'Diploma / Certificate Program' },
]

export const COMMON_FACILITIES_LIST = [
  'Hostel',
  'Central Library',
  'Campus Wi-Fi',
  'Advanced Research Labs',
  'Olympic Sports Complex',
  'Gymnasium',
  '24/7 Medical Hospital',
  'Cafeterias & Food Courts',
  'Convocation Auditorium',
  'Startup Incubation Center',
  'Placement & Career Cell',
  'ATM & Bank Branches',
  'Air Conditioned Classrooms',
  'Transport / Bus Service',
  'Differently-Abled Accessibility',
]

export const COMMON_ENTRANCE_EXAMS = [
  'JEE Advanced',
  'JEE Main',
  'BITSAT',
  'GATE',
  'CAT',
  'XAT',
  'MAT',
  'CMAT',
  'NEET UG',
  'NEET PG',
  'CLAT',
  'CUET UG',
  'CUET PG',
  'UCEED / CEED',
  'Institute Entrance Test',
]

export const DEFAULT_COLLEGE_DATA = {
  id: '',
  // Profile & Basic Details (Step 1)
  name: '',
  shortName: '',
  stream: '',
  ownership: '',
  establishmentYear: '',
  campusArea: '',
  affiliation: '',
  university: '',
  accreditation: '',
  naacGrade: '',
  nirfRank: '',
  nirfCategory: '',
  seats: '',
  tags: [],
  logo: '',
  image: '',
  description: '',
  snapshot: {
    accreditation: '',
    genderRatio: '',
    internationalOffers: '',
    totalFaculty: '',
    hostelCapacity: '',
  },

  // Location & Contact (Step 2)
  address: '',
  city: '',
  state: '',
  pincode: '',
  location: '',
  website: '',
  admissionEmail: '',
  helplinePhone: '',
  tollFreeHelpline: '',
  googleMapCoordinates: '',
  locationContact: {
    address: '',
    city: '',
    state: '',
    pincode: '',
    websiteUrl: '',
    admissionEmail: '',
    helplineNumber: '',
    alternatePhone: '',
    mapCoordinates: '',
  },

  // Dynamic Courses & Fees (Step 3)
  coursesOffered: [],

  // Admissions & Process (Step 4)
  admissionStatus: 'Admissions Open',
  academicYear: '2026 - 2027',
  applicationStartDate: '',
  applicationEndDate: '',
  examAccepted: [],
  admissionOverview: '',
  admissionProcessSteps: [],
  admissionPortalUrl: '',

  // Cutoffs (Step 5)
  admissionCutoffs: [],

  // Placements (Step 6)
  avgPackage: '',
  avgPackageVal: 0,
  highestPackage: '',
  totalFees: '',
  totalFeesVal: 0,
  feesPeriod: 'Yearly',
  placementPercent: 0,
  placements: {
    placementRate: 0,
    totalRecruiters: '',
    highestDomestic: '',
    highestInternational: '',
    avgPackage: '',
    medianPackage: '',
    totalOffers: '',
    topRecruiters: [],
  },

  // Rankings (Step 7)
  nirfRank: '',
  nirfCategory: '',
  naacGrade: '',
  rankings: {
    nirfRank: '',
    nirfCategory: '',
    nirfYear: 2025,
    naacGrade: '',
    naacCgpa: '',
    otherRankings: [],
  },
  additionalRankings: [],

  // Facilities & ROI / Hidden Costs (Step 8)
  facilities: [],
  hostelDetails: {
    totalHostels: '',
    totalCapacity: '',
    boysHostelDetails: '',
    girlsHostelDetails: '',
    messFoodType: '',
    annualHostelMessFee: '',
  },
  hiddenCosts: {
    tuitionFeePerYear: '',
    hostelRentYearly: '',
    messChargesYearly: '',
    cautionDepositOneTime: '',
    examinationMiscYearly: '',
    estimatedTotal4Yr: '',
    notes: '',
  },

  // Media & Gallery (Step 9)
  gallery: [],

  // Platform-Generated & Student Data
  rating: 0,
  reviewsCount: 0,
  similarColleges: [],
  prosAndCons: {
    pros: [],
    cons: [],
  },

  // Profile Lifecycle Status
  profileStatus: 'draft',
  lastUpdated: 'Just now',
  adminFeedback: [],
}

export const MOCK_IIT_BOMBAY_DATA = {
  id: 'iit-bombay',
  name: 'Indian Institute of Technology Bombay',
  shortName: 'IIT Bombay',
  stream: 'engineering',
  ownership: 'Government',
  establishmentYear: 1958,
  campusArea: '550 Acres',
  affiliation: 'Autonomous National University',
  university: 'Autonomous (Ministry of Education, GoI)',
  accreditation: 'NAAC A++ | IoE (Institute of Eminence)',
  naacGrade: 'A++ (3.88 CGPA)',
  nirfRank: 3,
  nirfCategory: 'Engineering',
  seats: '1,360',
  tags: ['Government', 'NIRF #3', 'NAAC A++', 'Institute of Eminence'],
  logo: '',
  image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&h=600&q=80',
  description: 'Premier public technical university located in Powai, Mumbai. Renowned for world-class computer science and engineering programs, stellar research output, and top international placements.',
  snapshot: {
    accreditation: 'NAAC A++ | IoE (Institute of Eminence)',
    genderRatio: '80:20 (Male:Female)',
    internationalOffers: '65+ Offers',
    totalFaculty: '680+ PhD Faculty',
    hostelCapacity: '18 Hostels (100% On-Campus Housing)',
  },
  address: 'Main Gate Road, IIT Area, Powai',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400076',
  location: 'Mumbai, Maharashtra',
  website: 'https://www.iitb.ac.in',
  admissionEmail: 'admissions@iitb.ac.in',
  helplinePhone: '+91-22-2572-2545',
  tollFreeHelpline: '1800-223-345',
  googleMapCoordinates: '19.1334° N, 72.9133° E',
  coursesOffered: [],
  admissionStatus: 'Admissions Open (Session 2026-27)',
  academicYear: '2026 - 2027',
  applicationStartDate: '2026-04-15',
  applicationEndDate: '2026-06-30',
  examAccepted: ['JEE Advanced', 'JEE Main', 'GATE', 'CAT', 'CEED / UCEED'],
  admissionOverview: 'Undergraduate admissions strictly through Joint Entrance Examination (JEE Advanced) counseling conducted via JoSAA.',
  admissionCutoffs: [],
  avgPackage: '₹24.5 LPA',
  avgPackageVal: 24.5,
  highestPackage: '₹1.50 Cr PA',
  totalFees: '₹8.94 Lakhs',
  totalFeesVal: 8.94,
  feesPeriod: '4 Yrs',
  placementPercent: 98,
  placements: {
    placementRate: 98,
    totalRecruiters: '350+',
    highestDomestic: '₹1.50 Cr PA',
    highestInternational: '₹3.70 Cr PA',
    avgPackage: '₹24.5 LPA',
    medianPackage: '₹20.0 LPA',
    totalOffers: '1,850+ Offers',
    topRecruiters: ['Google', 'Microsoft', 'Apple'],
  },
  nirfRank: 3,
  nirfCategory: 'Engineering',
  naacGrade: 'A++ (3.88 CGPA)',
  rankings: {
    nirfRank: 3,
    nirfCategory: 'Engineering',
    nirfYear: 2025,
    naacGrade: 'A++ (3.88 CGPA)',
    naacCgpa: '3.88',
    otherRankings: ['QS World University Rankings: #118', 'India Today: #2'],
  },
  additionalRankings: [
    { id: 'rank_1', agency: 'QS World University Rankings', year: '2025', rank: '#118 Worldwide', category: 'Overall' },
    { id: 'rank_2', agency: 'India Today', year: '2024', rank: '#2 National', category: 'Engineering' },
  ],
  facilities: ['Hostel', 'Gym', 'Sports', 'Wi-Fi', 'Library'],
  gallery: [],
  profileStatus: 'draft',
  lastUpdated: 'Just now',
}
