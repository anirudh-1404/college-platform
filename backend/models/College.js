import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  id: { type: String, default: () => `crs_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` },
  name: { type: String, required: true },
  degreeLevel: { type: String, default: "Undergraduate (UG)" },
  duration: { type: String, default: "4 Years" },
  fee: { type: String, default: "₹2.5 Lakhs/year" },
  seatIntake: { type: Number, default: 120 },
  avgSalary: { type: String, default: "₹18.5 LPA" },
  eligibility: { type: String, default: "10+2 with 75% aggregate in PCM + Entrance Qualification" },
  specializations: { type: [String], default: [] },
  careerOutcomes: { type: [String], default: [] },
});

const cutoffSchema = new mongoose.Schema({
  exam: { type: String, required: true },
  course: { type: String, required: true },
  generalCutoff: { type: String, default: "AIR 1 - 250" },
  obcCutoff: { type: String, default: "AIR 150 - 650" },
  scCutoff: { type: String, default: "AIR 400 - 1500" },
  stCutoff: { type: String, default: "AIR 600 - 2200" },
  year: { type: Number, default: 2025 },
  round: { type: String, default: "Round 6" },
});

const admissionStepSchema = new mongoose.Schema({
  step: { type: String, default: "1" },
  title: { type: String, default: "" },
  desc: { type: String, default: "" },
});

const feedbackSchema = new mongoose.Schema({
  id: { type: String, default: () => `fb_${Date.now()}` },
  date: { type: String, default: () => new Date().toLocaleDateString("en-IN") },
  comment: { type: String, required: true },
  requestedBy: { type: String, default: "VidyaScope Editorial Officer" },
  resolved: { type: Boolean, default: false },
});

const collegeSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
    },
    shortName: {
      type: String,
      default: "",
    },
    stream: {
      type: String,
      enum: ["engineering", "management", "medical", "law", "arts", "science", "commerce", "general"],
      default: "engineering",
    },
    ownership: {
      type: String,
      default: "Government",
    },
    establishmentYear: {
      type: Number,
      default: 1958,
    },
    campusArea: {
      type: String,
      default: "550 Acres",
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    },
    snapshot: {
      accreditation: { type: String, default: "UGC / AICTE / Institute of Eminence" },
      totalFaculty: { type: String, default: "650+ PhD Faculty" },
      hostelCapacity: { type: String, default: "11,000+ Students" },
      genderRatio: { type: String, default: "80:20 (M:F)" },
      avgClassSize: { type: String, default: "60 Students" },
      libraryVolumes: { type: String, default: "500,000+ Titles" },
    },
    locationContact: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      admissionEmail: { type: String, default: "" },
      helplineNumber: { type: String, default: "" },
      alternatePhone: { type: String, default: "" },
      websiteUrl: { type: String, default: "" },
      mapCoordinates: { type: String, default: "" },
      socialHandles: {
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        youtube: { type: String, default: "" },
      },
    },
    coursesOffered: [courseSchema],

    // Complete Admissions Fields
    admissionStatus: { type: String, default: "Admissions Open" },
    academicYear: { type: String, default: "2026 - 2027" },
    applicationStartDate: { type: String, default: "" },
    applicationEndDate: { type: String, default: "" },
    admissionPortalUrl: { type: String, default: "" },
    examAccepted: { type: [String], default: [] },
    admissionOverview: { type: String, default: "" },
    admissionProcessSteps: { type: [admissionStepSchema], default: [] },

    // Legacy / Convenience admissions object
    admissions: {
      status: { type: String, default: "Applications Open (2026–27)" },
      applicationStart: { type: String, default: "May 2026" },
      applicationEnd: { type: String, default: "July 2026" },
      examAccepted: { type: [String], default: ["JEE Advanced", "JEE Main", "GATE"] },
      admissionSteps: {
        type: [String],
        default: [
          "Qualify for National Entrance Exam",
          "Register for Centralized Counseling (JoSAA / JAC / NEET / CAT)",
          "Choice Filling and Seat Allocation Rounds",
          "Physical Document Verification & Fee Payment",
        ],
      },
    },
    admissionCutoffs: [cutoffSchema],
    placements: {
      highestDomestic: { type: String, default: "₹1.50 Cr PA" },
      highestInternational: { type: String, default: "₹2.20 Cr PA" },
      avgPackage: { type: String, default: "₹24.5 LPA" },
      medianSalary: { type: String, default: "₹20.0 LPA" },
      placementRate: { type: Number, default: 98 },
      topRecruiters: {
        type: [String],
        default: ["Google", "Microsoft", "Goldman Sachs", "Texas Instruments", "Qualcomm", "Amazon"],
      },
    },
    rankings: {
      nirfRank: { type: Number, default: 3 },
      nirfCategory: { type: String, default: "Engineering" },
      nirfYear: { type: Number, default: 2025 },
      naacGrade: { type: String, default: "A++ (3.88 CGPA)" },
      naacCgpa: { type: String, default: "3.88" },
      otherRankings: { type: [String], default: ["QS World University Rankings: #118", "India Today: #2"] },
    },
    hostelDetails: {
      totalHostels: { type: String, default: "" },
      totalCapacity: { type: String, default: "" },
      boysHostelDetails: { type: String, default: "" },
      girlsHostelDetails: { type: String, default: "" },
      messFoodType: { type: String, default: "" },
      annualHostelMessFee: { type: String, default: "" },
    },
    facilities: {
      type: [String],
      default: [
        "High-Speed Wi-Fi Campus",
        "Air-Conditioned Central Library",
        "Olympic-Size Sports Complex",
        "Single-Occupancy Hostels",
        "24x7 Medical Health Center",
        "Advanced Research Supercomputing Labs",
      ],
    },
    hiddenCosts: {
      tuitionFeePerYear: { type: Number, default: 200000 },
      hostelRentYearly: { type: Number, default: 35000 },
      messChargesYearly: { type: Number, default: 45000 },
      cautionDepositOneTime: { type: Number, default: 15000 },
      examinationMiscYearly: { type: Number, default: 12000 },
      estimatedTotal4Yr: { type: String, default: "₹11.83 Lakhs" },
      notes: { type: String, default: "" },
    },
    gallery: {
      type: [String],
      default: [
        "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
      ],
    },
    profileStatus: {
      type: String,
      enum: ["draft", "under_review", "changes_requested", "published"],
      default: "draft",
    },
    submittedAt: { type: String, default: null },
    publishedAt: { type: String, default: null },
    adminFeedback: [feedbackSchema],

    // Platform Exclusive Metadata
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 0 },
    prosAndCons: {
      pros: {
        type: [String],
        default: [
          "Unmatched peer group and research culture",
          "Top placement packages across tech and quantitative finance",
          "Lush green campus with state-of-the-art facilities",
        ],
      },
      cons: {
        type: [String],
        default: [
          "High academic rigor and semester workload",
          "Competitive relative grading policy",
        ],
      },
    },
    similarColleges: { type: [String], default: [] },
  },
  { timestamps: true, strict: false }
);

export const College = mongoose.model("College", collegeSchema);
