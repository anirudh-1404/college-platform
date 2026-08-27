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
  { id: 1, label: 'Basic Info', fullTitle: 'Basic Institutional Information', icon: Building2 },
  { id: 2, label: 'Location & Contact', fullTitle: 'Location & Communication Channels', icon: MapPin },
  { id: 3, label: 'Courses & Fees', fullTitle: 'Academic Programs & Dynamic Fee Structures', icon: BookOpen },
  { id: 4, label: 'Admissions', fullTitle: 'Admissions, Eligibility & Process', icon: Compass },
  { id: 5, label: 'Cutoffs', fullTitle: 'Entrance Examination Cutoff Matrix', icon: Award },
  { id: 6, label: 'Placements', fullTitle: 'Placement Records & Top Recruiters', icon: TrendingUp },
  { id: 7, label: 'Rankings', fullTitle: 'NIRF, NAAC & Regulatory Accreditations', icon: Award },
  { id: 8, label: 'Facilities & ROI', fullTitle: 'Campus Facilities & Hidden Cost Breakdown', icon: Sparkles },
  { id: 9, label: 'Gallery', fullTitle: 'Campus & Infrastructure Media Manager', icon: ImageIcon },
  { id: 10, label: 'Review & Submit', fullTitle: 'Live Public Review & Submission for Approval', icon: CheckCircle2 },
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
  id: 'iit-bombay',
  // Profile & Basic Details (Step 1)
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
  logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&h=200&q=80',
  image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&h=600&q=80',
  description: 'Premier public technical university located in Powai, Mumbai. Renowned for world-class computer science and engineering programs, stellar research output, and top international placements.',
  snapshot: {
    accreditation: 'NAAC A++ | IoE (Institute of Eminence)',
    genderRatio: '80:20 (Male:Female)',
    internationalOffers: '65+ Offers',
    totalFaculty: '680+ PhD Faculty',
    hostelCapacity: '18 Hostels (100% On-Campus Housing)',
  },

  // Location & Contact (Step 2)
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

  // Dynamic Courses & Fees (Step 3)
  coursesOffered: [
    {
      id: 'course-1',
      name: 'B.Tech in Computer Science & Engineering',
      degreeLevel: 'Undergraduate (B.Tech)',
      duration: '4 Years (8 Semesters)',
      fee: '₹8.94 Lakhs',
      annualFee: '₹2.24 Lakhs/Yr',
      totalFeeNumeric: 8.94,
      seatIntake: 124,
      eligibility: '10+2 with Physics, Chemistry, Math (min 75%) + Top Rank in JEE Advanced',
      avgSalary: '₹32.5 LPA',
      highestSalary: '₹1.50 Cr PA',
      overview: 'Flagship undergraduate program focusing on algorithms, theoretical computer science, AI & Machine Learning, distributed systems, and computer architecture.',
      admissionProcess: 'Admission is conducted strictly through JoSAA Centralized Counseling based on JEE Advanced All India Rank (AIR).',
      specializations: ['Artificial Intelligence & ML', 'Systems & Architecture', 'Cybersecurity', 'Theoretical Computer Science', 'Data Science'],
      careerOutcomes: ['Software Development Engineer (SDE)', 'AI/ML Research Scientist', 'Quantitative Finance Developer', 'Systems Architect'],
    },
    {
      id: 'course-2',
      name: 'B.Tech in Electrical Engineering',
      degreeLevel: 'Undergraduate (B.Tech)',
      duration: '4 Years (8 Semesters)',
      fee: '₹8.94 Lakhs',
      annualFee: '₹2.24 Lakhs/Yr',
      totalFeeNumeric: 8.94,
      seatIntake: 98,
      eligibility: '10+2 with PCM + JEE Advanced Rank',
      avgSalary: '₹26.2 LPA',
      highestSalary: '₹85.0 LPA',
      overview: 'Comprehensive curriculum covering microelectronics, VLSI design, signal processing, communication theory, and renewable power systems.',
      admissionProcess: 'JoSAA Centralized Counseling based on JEE Advanced AIR.',
      specializations: ['VLSI & Microelectronics', 'Signal Processing & Communications', 'Power Systems', 'Control & Robotics'],
      careerOutcomes: ['VLSI Design Engineer', 'Hardware Systems Engineer', 'Robotics Specialist', 'Quantitative Analyst'],
    },
    {
      id: 'course-3',
      name: 'B.Tech in Mechanical Engineering',
      degreeLevel: 'Undergraduate (B.Tech)',
      duration: '4 Years (8 Semesters)',
      fee: '₹8.94 Lakhs',
      annualFee: '₹2.24 Lakhs/Yr',
      totalFeeNumeric: 8.94,
      seatIntake: 140,
      eligibility: '10+2 with PCM + JEE Advanced Rank',
      avgSalary: '₹19.8 LPA',
      highestSalary: '₹65.0 LPA',
      overview: 'Deep foundations in thermodynamics, fluid mechanics, design engineering, robotics, and advanced manufacturing technologies.',
      admissionProcess: 'JoSAA Centralized Counseling based on JEE Advanced AIR.',
      specializations: ['Thermal & Fluids Engineering', 'Design Engineering', 'Automated Manufacturing', 'Computational Mechanics'],
      careerOutcomes: ['Design Engineer', 'Automotive Systems Specialist', 'Management Consultant', 'Supply Chain Analyst'],
    },
    {
      id: 'course-4',
      name: 'M.Tech in Data Science & Artificial Intelligence',
      degreeLevel: 'Postgraduate (M.Tech)',
      duration: '2 Years (4 Semesters)',
      fee: '₹2.10 Lakhs',
      annualFee: '₹1.05 Lakhs/Yr',
      totalFeeNumeric: 2.10,
      seatIntake: 45,
      eligibility: 'B.E./B.Tech degree in relevant discipline with valid GATE score + COAP Counseling',
      avgSalary: '₹23.0 LPA',
      highestSalary: '₹70.0 LPA',
      overview: 'Advanced postgraduate specialization offering deep training in deep learning, neural networks, natural language processing, and big data infrastructure.',
      admissionProcess: 'COAP Portal based on GATE Score followed by departmental written test and interview.',
      specializations: ['Deep Learning', 'Computer Vision', 'Natural Language Processing', 'Big Data Engineering'],
      careerOutcomes: ['Senior Data Scientist', 'AI Research Engineer', 'Machine Learning Architect'],
    },
  ],

  // Admissions & Process (Step 4)
  admissionStatus: 'Admissions Open (Session 2026-27)',
  academicYear: '2026 - 2027',
  applicationStartDate: '2026-04-15',
  applicationEndDate: '2026-06-30',
  examAccepted: ['JEE Advanced', 'JEE Main', 'GATE', 'CAT', 'CEED / UCEED'],
  admissionOverview: 'Undergraduate admissions strictly through Joint Entrance Examination (JEE Advanced) counseling conducted via JoSAA. Candidates must be in top 20 percentile in class 12th board or score 75%+ aggregate in PCM.',
  admissionProcessSteps: [
    { step: '1', title: 'Appear for Entrance Exam', desc: 'Clear JEE Main (for B.Tech) and qualify for JEE Advanced national examination.' },
    { step: '2', title: 'JoSAA Counseling Registration', desc: 'Register on the central JoSAA portal and fill IIT Bombay academic branch choices in order of preference.' },
    { step: '3', title: 'Seat Allotment Rounds', desc: 'Verify seat allocation across 6 rounds of JoSAA seat allotment based on category rank cutoffs.' },
    { step: '4', title: 'Physical Verification & Fee Settlement', desc: 'Report to IIT Bombay campus for document verification and semester fee settlement.' },
  ],
  admissionPortalUrl: 'https://josaa.nic.in',

  // Cutoffs (Step 5)
  admissionCutoffs: [
    { id: 'c1', exam: 'JEE Advanced 2025', course: 'Computer Science & Engineering (B.Tech)', generalCutoff: 'AIR 1 - 67', obcCutoff: 'AIR 1 - 32', scStCutoff: 'AIR 1 - 15' },
    { id: 'c2', exam: 'JEE Advanced 2025', course: 'Electrical Engineering', generalCutoff: 'AIR 120 - 380', obcCutoff: 'AIR 80 - 190', scStCutoff: 'AIR 40 - 110' },
    { id: 'c3', exam: 'JEE Advanced 2025', course: 'Mechanical Engineering', generalCutoff: 'AIR 650 - 1420', obcCutoff: 'AIR 300 - 620', scStCutoff: 'AIR 150 - 390' },
    { id: 'c4', exam: 'GATE 2025', course: 'M.Tech Data Science & AI', generalCutoff: 'Score 780+', obcCutoff: 'Score 720+', scStCutoff: 'Score 580+' },
  ],

  // Placements (Step 6)
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
    topRecruiters: ['Google', 'Microsoft', 'Apple', 'Goldman Sachs', 'Qualcomm', 'McKinsey & Co', 'Texas Instruments', 'Amazon', 'Rubrik', 'Uber'],
  },

  // Rankings (Step 7)
  rankings: [
    { id: 'r1', agency: 'NIRF Engineering', year: '2025', rank: '#3 in India', category: 'Engineering Institutions' },
    { id: 'r2', agency: 'NIRF Overall', year: '2025', rank: '#4 in India', category: 'All Higher Education Institutions' },
    { id: 'r3', agency: 'QS World University Rankings', year: '2026', rank: '#118 Worldwide', category: 'Top Ranked in India' },
    { id: 'r4', agency: 'QS Asian University Rankings', year: '2025', rank: '#35 in Asia', category: 'Regional Ranking' },
    { id: 'r5', agency: 'India Today Best Colleges', year: '2025', rank: '#1 in India', category: 'Engineering & Technology' },
  ],

  // Facilities & ROI / Hidden Costs (Step 8)
  facilities: [
    'Hostel',
    'Gym',
    'Sports',
    'Wi-Fi',
    'Library',
    'Placement Cell',
    'Cafeterias & Food Courts',
    '24/7 Medical Hospital',
    'Startup Incubation Center',
    'Convocation Auditorium',
  ],
  hostelDetails: {
    totalHostels: '18 Hostels (14 Boys, 3 Girls, 1 Co-ed PG)',
    totalCapacity: '11,500+ Residents (100% On-Campus Housing)',
    boysHostelDetails: 'Single & twin occupancy rooms with high-speed LAN, solar water heaters, study lounges, and sports courts.',
    girlsHostelDetails: 'Dedicated secure premises with biometric access control, attached study lounges, and 24/7 security staff.',
    messFoodType: 'Student-managed cooperative mess serving multi-cuisine meals.',
    annualHostelMessFee: '₹64,000 / Year',
  },
  hiddenCosts: {
    tuitionFeePerYear: 200000,
    hostelRentYearly: 28000,
    messChargesYearly: 36000,
    cautionDepositOneTime: 10000,
    examinationMiscYearly: 12000,
    estimatedTotal4Yr: '₹11.20 Lakhs',
    notes: 'Hostel and mess charges are compulsory for resident B.Tech students. Mess charges subject to actual dietary choices.',
  },

  // Media & Gallery (Step 9)
  gallery: [
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  ],

  // Platform-Generated & Student Data (Read-only for College Dashboard, rendered with Lock)
  rating: 4.9,
  reviewsCount: 2450,
  similarColleges: ['iit-delhi', 'bits-pilani', 'iiit-hyderabad'],
  prosAndCons: {
    pros: [
      'Unmatched peer group and highly competitive coding & research culture',
      'Top placement packages across Tech, Quantitative Finance, and Consulting',
      'Lush green 550-acre campus situated right next to Powai Lake',
      'Strong international alumni network and prestigious brand recognition',
    ],
    cons: [
      'High academic rigor and demanding semester workload',
      'Strict relative grading policy in core departmental courses',
    ],
  },

  // Profile Lifecycle Status
  profileStatus: 'draft', // 'draft' | 'under_review' | 'changes_requested' | 'published'
  lastUpdated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  adminFeedback: [
    {
      id: 'fb-1',
      date: '27 Aug 2026, 11:30 AM',
      comment: 'Please verify the updated NIRF 2025 certification and add specialized career outcomes for M.Tech Data Science program.',
      requestedBy: 'VidyaScope Verification Officer',
      resolved: false,
    },
  ],
}
