import { College } from "../models/College.js";
import { CareerGuide } from "../models/CareerGuide.js";
import { Exam } from "../models/Exam.js";
import { Inquiry } from "../models/Inquiry.js";

// 1. GET ALL PUBLISHED COLLEGES (With Search & Filter Query Support)
export const getPublicColleges = async (req, res) => {
  try {
    const { stream, query, location, sort, minPackage, maxFees, ownership } = req.query;

    const filter = { profileStatus: "published" };

    if (stream && stream !== "all") {
      filter.stream = stream.toLowerCase();
    }

    if (ownership && ownership !== "all") {
      filter.ownership = new RegExp(ownership, "i");
    }

    if (location && location !== "all") {
      filter.$or = [
        { "locationContact.city": new RegExp(location, "i") },
        { "locationContact.state": new RegExp(location, "i") },
      ];
    }

    if (query && query.trim() !== "") {
      const regex = new RegExp(query.trim(), "i");
      filter.$or = [
        { name: regex },
        { shortName: regex },
        { "locationContact.city": regex },
        { "locationContact.state": regex },
        { "coursesOffered.name": regex },
      ];
    }

    let sortOptions = { "rankings.nirfRank": 1, updatedAt: -1 };
    if (sort === "nirf") sortOptions = { "rankings.nirfRank": 1 };
    if (sort === "rating") sortOptions = { rating: -1 };

    const colleges = await College.find(filter).sort(sortOptions);

    // Map to clean format for public frontend consumption
    const formatted = colleges.map((c) => ({
      id: c.slug || c._id,
      slug: c.slug,
      name: c.name,
      shortName: c.shortName || c.name,
      stream: c.stream,
      ownership: c.ownership,
      establishmentYear: c.establishmentYear,
      campusArea: c.campusArea,
      description: c.description,
      logo: c.logo,
      image: c.image,
      location: `${c.locationContact?.city || ""}${c.locationContact?.city && c.locationContact?.state ? ", " : ""}${c.locationContact?.state || "India"}`,
      locationContact: c.locationContact,
      nirfRank: c.rankings?.nirfRank || 1,
      naacGrade: c.rankings?.naacGrade || "A++",
      rating: c.rating || 4.8,
      reviewsCount: c.reviewsCount || 120,
      avgPackage: c.placements?.avgPackage || "₹18.5 LPA",
      highestPackage: c.placements?.highestDomestic || "₹1.50 Cr PA",
      totalFees: c.coursesOffered?.[0]?.fee || "₹2.5 Lakhs/year",
      feesPeriod: "4 Years",
      examAccepted: c.admissions?.examAccepted || ["National Entrance"],
      placementPercent: c.placements?.placementRate || 95,
      facilities: c.facilities || [],
      coursesOffered: c.coursesOffered || [],
      admissionCutoffs: c.admissionCutoffs || [],
      placements: c.placements,
      hiddenCosts: c.hiddenCosts,
      gallery: c.gallery,
      prosAndCons: c.prosAndCons,
      similarColleges: c.similarColleges,
      snapshot: c.snapshot,
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      colleges: formatted,
    });
  } catch (error) {
    console.error("getPublicColleges error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch published colleges." });
  }
};

// 2. GET SINGLE COLLEGE DETAIL
export const getPublicCollegeDetail = async (req, res) => {
  try {
    const { id } = req.params;

    let college = await College.findOne({ slug: id });
    if (!college) {
      college = await College.findById(id);
    }

    if (!college) {
      return res.status(404).json({ success: false, message: "College not found or not yet published." });
    }

    const formatted = {
      id: college.slug || college._id,
      slug: college.slug,
      name: college.name,
      shortName: college.shortName || college.name,
      stream: college.stream,
      ownership: college.ownership,
      establishmentYear: college.establishmentYear,
      campusArea: college.campusArea,
      description: college.description,
      logo: college.logo,
      image: college.image,
      location: `${college.locationContact?.city || ""}${college.locationContact?.city && college.locationContact?.state ? ", " : ""}${college.locationContact?.state || "India"}`,
      locationContact: college.locationContact,
      nirfRank: college.rankings?.nirfRank || 1,
      naacGrade: college.rankings?.naacGrade || "A++",
      rating: college.rating || 4.8,
      reviewsCount: college.reviewsCount || 120,
      avgPackage: college.placements?.avgPackage || "₹18.5 LPA",
      highestPackage: college.placements?.highestDomestic || "₹1.50 Cr PA",
      totalFees: college.coursesOffered?.[0]?.fee || "₹2.5 Lakhs/year",
      feesPeriod: "4 Years",
      examAccepted: college.admissions?.examAccepted || ["National Entrance"],
      placementPercent: college.placements?.placementRate || 95,
      facilities: college.facilities || [],
      coursesOffered: college.coursesOffered || [],
      admissions: college.admissions,
      admissionCutoffs: college.admissionCutoffs || [],
      placements: college.placements,
      rankings: college.rankings,
      hiddenCosts: college.hiddenCosts,
      gallery: college.gallery,
      prosAndCons: college.prosAndCons,
      similarColleges: college.similarColleges,
      snapshot: college.snapshot,
    };

    return res.status(200).json({ success: true, college: formatted });
  } catch (error) {
    console.error("getPublicCollegeDetail error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch college details." });
  }
};

// 3. GET DYNAMIC COURSES & EXAMS DIRECTORY
export const getPublicCourses = async (req, res) => {
  try {
    const colleges = await College.find({ profileStatus: "published" });

    const allCourses = [];
    colleges.forEach((c) => {
      (c.coursesOffered || []).forEach((crs) => {
        allCourses.push({
          ...crs.toObject(),
          collegeName: c.name,
          collegeSlug: c.slug,
          nirfRank: c.rankings?.nirfRank,
        });
      });
    });

    return res.status(200).json({ success: true, count: allCourses.length, courses: allCourses });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch courses directory." });
  }
};

// 4. GET PUBLIC CAREER GUIDES (Roadmaps)
export const getPublicCareerGuides = async (req, res) => {
  try {
    const { category, query } = req.query;
    const filter = { published: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (query && query.trim() !== "") {
      const regex = new RegExp(query.trim(), "i");
      filter.$or = [
        { title: regex },
        { shortDescription: regex },
        { requiredDegrees: regex },
        { targetExams: regex },
      ];
    }

    const guides = await CareerGuide.find(filter).sort({ createdAt: -1 });

    const formatted = guides.map((g) => ({
      id: g.slug || g._id,
      slug: g.slug,
      title: g.title,
      category: g.category,
      shortDescription: g.shortDescription,
      averageSalary: g.averageSalary,
      eligibility: g.eligibility,
      requiredDegrees: g.requiredDegrees || [],
      targetExams: g.targetExams || [],
      topRecruiters: g.topRecruiters || [],
      roadmapSteps: g.roadmapSteps || [],
      published: g.published,
      createdAt: g.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      guides: formatted,
    });
  } catch (error) {
    console.error("getPublicCareerGuides error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch career roadmaps." });
  }
};

// 5. GET SINGLE PUBLIC CAREER GUIDE DETAIL
export const getPublicCareerGuideDetail = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    let guide = await CareerGuide.findOne({ slug: slugOrId, published: true });
    if (!guide) {
      guide = await CareerGuide.findById(slugOrId);
    }

    if (!guide || !guide.published) {
      return res.status(404).json({ success: false, message: "Career roadmap not found." });
    }

    return res.status(200).json({
      success: true,
      guide: {
        id: guide.slug || guide._id,
        slug: guide.slug,
        title: guide.title,
        category: guide.category,
        shortDescription: guide.shortDescription,
        averageSalary: guide.averageSalary,
        eligibility: guide.eligibility,
        requiredDegrees: guide.requiredDegrees || [],
        targetExams: guide.targetExams || [],
        topRecruiters: guide.topRecruiters || [],
        roadmapSteps: guide.roadmapSteps || [],
        published: guide.published,
        createdAt: guide.createdAt,
      },
    });
  } catch (error) {
    console.error("getPublicCareerGuideDetail error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch career roadmap." });
  }
};

// 6. GET PUBLIC ENTRANCE EXAMS (With Category & Search Filter)
export const getPublicExams = async (req, res) => {
  try {
    const { category, query } = req.query;
    const filter = { published: true };

    if (category && category !== "all") {
      filter.category = category.toLowerCase();
    }

    if (query && query.trim() !== "") {
      const regex = new RegExp(query.trim(), "i");
      filter.$or = [
        { name: regex },
        { shortName: regex },
        { conductingBody: regex },
        { eligibility: regex },
      ];
    }

    const exams = await Exam.find(filter).sort({ createdAt: -1 });

    const formatted = exams.map((e) => ({
      id: e.slug || e._id,
      slug: e.slug,
      name: e.name,
      shortName: e.shortName,
      category: e.category,
      conductingBody: e.conductingBody,
      level: e.level,
      mode: e.mode,
      frequency: e.frequency,
      duration: e.duration,
      totalMarks: e.totalMarks,
      eligibility: e.eligibility,
      examDates: e.examDates,
      targetCollegesCount: e.targetCollegesCount,
      overview: e.overview,
      syllabusHighlights: e.syllabusHighlights || [],
      published: e.published,
      createdAt: e.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      exams: formatted,
    });
  } catch (error) {
    console.error("getPublicExams error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch entrance exams." });
  }
};

// 7. GET SINGLE PUBLIC EXAM DETAIL
export const getPublicExamDetail = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    let exam = await Exam.findOne({ slug: slugOrId, published: true });
    if (!exam) {
      exam = await Exam.findById(slugOrId);
    }

    if (!exam || !exam.published) {
      return res.status(404).json({ success: false, message: "Entrance exam not found." });
    }

    return res.status(200).json({
      success: true,
      exam: {
        id: exam.slug || exam._id,
        slug: exam.slug,
        name: exam.name,
        shortName: exam.shortName,
        category: exam.category,
        conductingBody: exam.conductingBody,
        level: exam.level,
        mode: exam.mode,
        frequency: exam.frequency,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        eligibility: exam.eligibility,
        examDates: exam.examDates,
        targetCollegesCount: exam.targetCollegesCount,
        overview: exam.overview,
        syllabusHighlights: exam.syllabusHighlights || [],
        published: exam.published,
        createdAt: exam.createdAt,
      },
    });
  } catch (error) {
    console.error("getPublicExamDetail error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch entrance exam." });
  }
};

// 6. CREATE PUBLIC INQUIRY / COUNSELING REQUEST
export const createPublicInquiry = async (req, res) => {
  try {
    const {
      studentName,
      name,
      email,
      phone,
      stream,
      targetScore,
      preferredLocation,
      budgetRange,
      admissionYear,
      targetYear,
      notes,
      collegeId,
      collegeName,
      source,
    } = req.body;

    const resolvedName = (studentName || name || "").trim();
    const resolvedPhone = (phone || "").trim();

    if (!resolvedName) {
      return res.status(400).json({ success: false, message: "Student name is required." });
    }

    if (!resolvedPhone) {
      return res.status(400).json({ success: false, message: "Contact phone number is required." });
    }

    const newInquiry = await Inquiry.create({
      studentName: resolvedName,
      email: (email || "").trim(),
      phone: resolvedPhone,
      stream: stream || "engineering",
      targetScore: targetScore || "",
      preferredLocation: preferredLocation || "",
      budgetRange: budgetRange || "under-10",
      admissionYear: admissionYear || targetYear || new Date().getFullYear().toString(),
      notes: notes || "",
      collegeId: collegeId || null,
      collegeName: collegeName || null,
      source: source || "counseling_modal",
      status: "new",
    });

    return res.status(201).json({
      success: true,
      message: "Your counseling request has been received. Our expert will contact you shortly.",
      inquiry: {
        id: newInquiry._id,
        studentName: newInquiry.studentName,
        createdAt: newInquiry.createdAt,
      },
    });
  } catch (error) {
    console.error("createPublicInquiry error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit counseling request. Please try again.",
      error: error.message,
    });
  }
};
