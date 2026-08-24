/**
 * Initial Master Mock Data for VidyaScope College Dashboard (CMS)
 * Exact correspondence to the Public Website's College Detail representation.
 */

export const initialCollegeData = {
  // Status & Metadata
  status: 'published', // 'published' | 'under-review' | 'draft'
  completionPercent: 94,
  lastUpdated: '24 Aug 2026, 04:30 PM',
  publishedUrl: 'https://vidyascope.com/colleges/iit-bombay',

  // 1. Profile Basics
  profile: {
    name: 'Indian Institute of Technology Bombay',
    shortName: 'IIT Bombay',
    collegeType: 'Public Institute of National Importance',
    ownership: 'Public / Government',
    establishedYear: '1958',
    campusArea: '550 Acres (Powai Campus)',
    affiliation: 'Autonomous National University',
    university: 'Autonomous (Ministry of Education, GoI)',
    accreditation: 'AICTE, UGC, MHRD Institute of Eminence',
    naacGrade: 'A++ (3.88 CGPA)',
    nirfRank: '3',
    nirfCategory: 'Engineering (Overall Rank #4)',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
    website: 'https://www.iitb.ac.in',
    shortDescription: 'Established in 1958, IIT Bombay is India’s foremost institute for technological education and engineering research, celebrated for world-class faculty, deep industry linkages, and high placement records.',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&h=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&h=500&q=80',
  },

  // 2. About College
  about: {
    overview: 'Indian Institute of Technology Bombay (IIT Bombay) is widely recognized as one of the apex institutions of higher technical education in Asia. Located in the picturesque Powai lakeside in Mumbai, the institute spans across 550 green acres housing 16 academic departments, 39 specialized centers, and over 12,000 undergraduate, postgraduate, and doctoral students.\n\nOver six decades, IIT Bombay has nurtured globally celebrated engineers, research scientists, startup founders, and corporate leaders. The campus offers state-of-the-art computational infrastructure, sophisticated research labs funded by international agencies, and a vibrant student community.',
    vision: 'To be the fountainhead of new ideas and of innovators in technology and science, contributing meaningfully to national growth and global technological breakthroughs.',
    mission: 'To create an ambience in which new ideas, research, and scholarship flourish, and from which the leaders, innovators, and entrepreneurs of tomorrow emerge.',
    directorMessage: 'At IIT Bombay, we believe that education is an empowering transformation. Our students are challenged to solve real-world problems from day one through hands-on multidisciplinary research and creative freedom.',
    directorName: 'Prof. Shireesh B. Kedare',
    directorTitle: 'Director, IIT Bombay',
    highlights: [
      'Declared as an "Institute of Eminence" (IoE) by the Government of India',
      'Consistent NIRF Top 3 Rank in Engineering for 8 consecutive years',
      'Over 400+ leading international & domestic recruiters visit campus annually',
      'Society for Innovation and Entrepreneurship (SINE) has incubated 220+ startups',
      '550-acre green campus beside Powai Lake with residential hostels and sporting hubs',
    ],
  },

  // 3. Courses & Programs
  courses: [
    {
      id: 'btech-cse',
      name: 'B.Tech in Computer Science & Engineering',
      degree: 'B.Tech (Undergraduate)',
      duration: '4 Years (8 Semesters)',
      eligibility: '10+2 with PCM (min 75% aggregate) + Top rank in JEE Advanced',
      fees: '₹2,24,000 / Year (₹8.96 Lakhs Total)',
      seats: 175,
      level: 'Undergraduate',
      specializations: ['Artificial Intelligence & ML', 'Systems & Cloud Architecture', 'Theoretical Computer Science', 'Data Analytics'],
    },
    {
      id: 'btech-ee',
      name: 'B.Tech in Electrical Engineering',
      degree: 'B.Tech (Undergraduate)',
      duration: '4 Years (8 Semesters)',
      eligibility: '10+2 with PCM (min 75% aggregate) + JEE Advanced Rank',
      fees: '₹2,24,000 / Year (₹8.96 Lakhs Total)',
      seats: 160,
      level: 'Undergraduate',
      specializations: ['Microelectronics & VLSI', 'Signal Processing', 'Power Electronics', 'Control Systems'],
    },
    {
      id: 'btech-me',
      name: 'B.Tech in Mechanical Engineering',
      degree: 'B.Tech (Undergraduate)',
      duration: '4 Years (8 Semesters)',
      eligibility: '10+2 with PCM (min 75% aggregate) + JEE Advanced Rank',
      fees: '₹2,24,000 / Year (₹8.96 Lakhs Total)',
      seats: 170,
      level: 'Undergraduate',
      specializations: ['Thermal & Fluids', 'Design Engineering', 'Robotics & Mechatronics', 'Manufacturing'],
    },
    {
      id: 'mtech-cs',
      name: 'M.Tech in Computer Science & Engineering',
      degree: 'M.Tech (Postgraduate)',
      duration: '2 Years (4 Semesters)',
      eligibility: 'B.Tech / B.E. in relevant discipline + Valid GATE Score',
      fees: '₹68,000 / Year (₹1.36 Lakhs Total)',
      seats: 120,
      level: 'Postgraduate',
      specializations: ['Machine Learning', 'Computer Networks', 'Database Systems', 'Cryptography'],
    },
    {
      id: 'mba-sjmsom',
      name: 'Master of Management (MBA)',
      degree: 'MBA (SJMSOM)',
      duration: '2 Years (4 Semesters)',
      eligibility: 'B.Tech / B.E. with 60% + Valid CAT 98.5+ Percentile',
      fees: '₹5,50,000 / Year (₹11.0 Lakhs Total)',
      seats: 152,
      level: 'Postgraduate',
      specializations: ['Technology & Operations', 'Corporate Finance', 'Strategic Marketing', 'Business Analytics'],
    },
  ],

  // 4. Admissions
  admissions: {
    status: 'Admissions Open (Session 2026-27)',
    academicYear: '2026 - 2027',
    applicationStart: '15 April 2026',
    applicationEnd: '30 June 2026',
    acceptedExams: ['JEE Advanced (for B.Tech)', 'GATE (for M.Tech)', 'CAT (for MBA)', 'CEED / UCEED (for Design)', 'JAM (for M.Sc)'],
    eligibilityOverview: 'Undergraduate admissions strictly through Joint Entrance Examination (JEE Advanced) counseling conducted via JoSAA. Candidates must be in top 20 percentile in class 12th board or score 75%+ aggregate in PCM.',
    processSteps: [
      { step: '1', title: 'Appear for Entrance Exam', desc: 'Clear JEE Main (for B.Tech) and qualify for JEE Advanced national examination.' },
      { step: '2', title: 'JoSAA Counseling Registration', desc: 'Register on the central JoSAA portal and fill IIT Bombay academic branch choices in order of preference.' },
      { step: '3', title: 'Seat Allotment Rounds', desc: 'Verify seat allocation across 6 rounds of JoSAA seat allotment based on category rank cutoffs.' },
      { step: '4', title: 'Physical Verification & Fee Payment', desc: 'Report to IIT Bombay campus for document verification and semester fee settlement.' },
    ],
    ctaButtonText: 'Apply Through JoSAA Portal',
    ctaUrl: 'https://josaa.nic.in',
  },

  // 5. Fees Structure
  fees: {
    tuitionFeePerSem: '₹1,00,000',
    otherAcademicPerSem: '₹12,000',
    oneTimeAdmissionFee: '₹10,500',
    refundableCautionDeposit: '₹10,000',
    totalAnnualTuition: '₹2,24,000',
    hostelMessAnnual: '₹68,000',
    estimatedTotalFourYears: '₹11.60 Lakhs (Including Hostel & Mess)',
    waiverPolicy: '100% Tuition Fee waiver for SC / ST / PwD students. Full tuition waiver for economically backward students with family income < ₹1 Lakh/yr, and 2/3rd waiver for income between ₹1L - ₹5L/yr.',
  },

  // 6. Facilities
  facilities: [
    { id: 'library', name: 'Central Library', icon: 'BookOpen', available: true, desc: 'Over 5,00,000 books, 40,000 online e-journals, and 24/7 air-conditioned reading halls.' },
    { id: 'wifi', name: 'Campus High-Speed Wi-Fi', icon: 'Wifi', available: true, desc: '10 Gbps gigabit optical fiber network across all academic buildings and hostels.' },
    { id: 'labs', name: 'Advanced Research Labs', icon: 'FlaskConical', available: true, desc: 'Nanotechnology labs, supercomputing clusters, and sophisticated analytical instruments.' },
    { id: 'sports', name: 'Olympic Sports Complex', icon: 'Trophy', available: true, desc: 'Olympic-size swimming pool, floodlit football turf, tennis courts, and indoor badminton arena.' },
    { id: 'hospital', name: 'IITB Hospital (24/7)', icon: 'Stethoscope', available: true, desc: 'Full-fledged 65-bed in-house hospital with specialist doctors, pathology lab, and ambulances.' },
    { id: 'hostel', name: 'Residential Hostels', icon: 'Home', available: true, desc: '18 student hostels with high-speed LAN, reading rooms, gymnasiums, and clean mess facilities.' },
    { id: 'cafeteria', name: 'Cafeterias & Food Courts', icon: 'Utensils', available: true, desc: 'Multiple multicuisine cafeterias, CCD, Subway, and night canteens across campus.' },
    { id: 'auditorium', name: 'Convocation Auditorium', icon: 'Building2', available: true, desc: '2,500-seater main auditorium equipped with professional acoustics and theater projection.' },
    { id: 'incubation', name: 'SINE Startup Incubator', icon: 'Rocket', available: true, desc: 'Dedicated incubator providing seed funding, mentor networks, and lab space for student startups.' },
    { id: 'bank', name: 'Bank & ATMs', icon: 'Landmark', available: true, desc: 'On-campus branches of State Bank of India and Canara Bank with multiple 24-hr ATM kiosks.' },
  ],

  // 7. Placements
  placements: {
    highestDomesticPackage: '₹1.68 Crore / Annum',
    highestInternationalPackage: '₹2.80 Crore / Annum (US Tech Offer)',
    averagePackage: '₹23.5 LPA',
    medianPackage: '₹19.2 LPA',
    overallPlacementRate: '94.8%',
    totalOffers: '1,850+ Offers',
    participatingCompanies: '420+ Companies',
    topRecruiters: [
      'Google', 'Microsoft', 'Apple', 'Amazon', 'Qualcomm',
      'Goldman Sachs', 'McKinsey & Company', 'Boston Consulting Group',
      'Jane Street', 'Texas Instruments', 'Uber', 'Samsung R&D',
      'Tata Consultancy Services', 'Rubrik', 'Intel'
    ],
  },

  // 8. Rankings & Accreditations
  rankings: [
    { agency: 'NIRF Engineering', year: '2025', rank: '#3 in India', category: 'Engineering Institutions' },
    { agency: 'NIRF Overall', year: '2025', rank: '#4 in India', category: 'All Higher Education Institutions' },
    { agency: 'QS World University Rankings', year: '2026', rank: '#118 Worldwide', category: 'Top Ranked in India' },
    { agency: 'QS Asian University Rankings', year: '2025', rank: '#35 in Asia', category: 'Regional Ranking' },
    { agency: 'India Today Best Colleges', year: '2025', rank: '#1 in India', category: 'Engineering & Technology' },
  ],

  // 9. Scholarships
  scholarships: [
    {
      id: 'mcm',
      title: 'Institute Merit-cum-Means (MCM) Scholarship',
      eligibility: 'For B.Tech / Dual Degree students whose parental gross annual income is below ₹5 Lakhs.',
      benefit: 'Full Tuition Fee Waiver + ₹1,000/month allowance for 10 months each academic year.',
      category: 'Need-based Merit',
    },
    {
      id: 'free-studentship',
      title: 'Institute Free Studentship',
      eligibility: 'Awarded to 10% of the total student strength based on income criteria below ₹5 Lakhs/year.',
      benefit: '100% Tuition fee exemption.',
      category: 'Tuition Waiver',
    },
    {
      id: 'sc-st-scholarship',
      title: 'Government SC / ST / PwD Scholarship',
      eligibility: 'All admitted SC/ST and Persons with Disability undergraduate candidates.',
      benefit: '100% Tuition fee waiver + Free basic hostel accommodation + Monthly pocket allowance.',
      category: 'Social Category',
    },
    {
      id: 'donor-scholarship',
      title: 'Alumni & Named Donor Endowments',
      eligibility: 'Branch toppers and students excelling in interdisciplinary innovation projects.',
      benefit: 'Cash rewards ranging from ₹50,000 to ₹2,50,000 per annum.',
      category: 'Merit Award',
    },
  ],

  // 10. Hostel & Accommodation
  hostels: {
    totalHostels: '18 Hostels (14 Boys, 3 Girls, 1 Co-ed PG)',
    totalCapacity: '11,500+ Residents',
    boysHostelDetails: 'Spacious single and twin-sharing rooms equipped with study tables, wardrobes, high-speed Ethernet ports, solar water heating, common recreation rooms, and laundry facilities.',
    girlsHostelDetails: 'Dedicated secure hostel buildings with biometric entry control, attached study lounges, in-house night canteens, indoor badminton courts, and 24/7 female security staff.',
    messFoodType: 'Student-managed cooperative mess serving nutritious North & South Indian, vegetarian, and non-vegetarian meals.',
    annualHostelMessFee: '₹68,000 / Year (₹34,000 per semester)',
  },

  // 11. Gallery Photos
  gallery: [
    { id: '1', title: 'Main Academic Building & Clock Tower', category: 'Campus', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&h=500&q=80' },
    { id: '2', title: 'Central Library Digital Learning Hub', category: 'Library', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&h=500&q=80' },
    { id: '3', title: 'Supercomputing & Robotics Laboratory', category: 'Labs', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&h=500&q=80' },
    { id: '4', title: 'Olympic Size Swimming Pool & Sports Arena', category: 'Sports', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&h=500&q=80' },
    { id: '5', title: 'Hostel Residential Quadrangle & Lawns', category: 'Hostels', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&h=500&q=80' },
    { id: '6', title: 'Convocation Hall Annual Ceremony', category: 'Events', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&h=500&q=80' },
  ],

  // 12. Frequently Asked Questions
  faqs: [
    {
      id: 'faq-1',
      question: 'What is the cutoff rank for B.Tech Computer Science at IIT Bombay?',
      category: 'Admissions',
      answer: 'For General Category candidates, the opening rank in JEE Advanced is typically AIR 1 and the closing rank closes around AIR 60-68 in JoSAA Round 6. Other branches like Electrical Engineering close around AIR 350-450.',
    },
    {
      id: 'faq-2',
      question: 'Is 100% campus hostel accommodation guaranteed for all undergraduate students?',
      category: 'Campus Life',
      answer: 'Yes, IIT Bombay is a fully residential campus. All undergraduate B.Tech and Dual Degree students are guaranteed hostel accommodation on campus for the entire 4-year duration.',
    },
    {
      id: 'faq-3',
      question: 'What financial aid or scholarships are available for economically weaker students?',
      category: 'Fees & Aid',
      answer: 'Under the Merit-cum-Means (MCM) scheme and Government guidelines, students with parental income below ₹1 Lakh per annum receive a 100% full tuition fee waiver, while those between ₹1L to ₹5L receive a 67% fee waiver.',
    },
    {
      id: 'faq-4',
      question: 'Can undergraduate students participate in research projects?',
      category: 'Academics',
      answer: 'Yes, the Undergraduate Research Experience (URE) and Undergraduate Research Awards (URA) encourage B.Tech students to publish research papers with faculty members starting from their second year.',
    },
  ],

  // 13. Contact & Location
  contact: {
    address: 'Main Gate Road, IIT Area, Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
    country: 'India',
    admissionEmail: 'admissions@iitb.ac.in',
    publicRelationsEmail: 'pro@iitb.ac.in',
    tollFreeHelpline: '1800-223-345',
    phone: '+91-22-2572-2545',
    fax: '+91-22-2572-3480',
    googleMapCoordinates: '19.1334° N, 72.9133° E',
  },
}
