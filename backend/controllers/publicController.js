import mongoose from "mongoose";
import { College } from "../models/College.js";
import { CareerGuide } from "../models/CareerGuide.js";
import { Exam } from "../models/Exam.js";
import { Inquiry } from "../models/Inquiry.js";
import { LiveIntel } from "../models/LiveIntel.js";
import { Blog } from "../models/Blog.js";
import { sendInquiryNotificationEmail } from "../utils/emailService.js";

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
    if (!college && mongoose.Types.ObjectId.isValid(id)) {
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
      examAccepted: college.examAccepted?.length ? college.examAccepted : (college.admissions?.examAccepted || ["National Entrance"]),
      placementPercent: college.placements?.placementRate || 95,
      facilities: college.facilities || [],
      coursesOffered: college.coursesOffered || [],
      admissions: college.admissions,
      admissionStatus: college.admissionStatus || college.admissions?.status || "Admissions Open",
      academicYear: college.academicYear || "2026 - 2027",
      applicationStartDate: college.applicationStartDate || college.admissions?.applicationStart || "",
      applicationEndDate: college.applicationEndDate || college.admissions?.applicationEnd || "",
      admissionPortalUrl: college.admissionPortalUrl || "",
      admissionOverview: college.admissionOverview || "",
      admissionProcessSteps: college.admissionProcessSteps || [],
      admissionCutoffs: college.admissionCutoffs || [],
      placements: college.placements,
      rankings: college.rankings,
      hostelDetails: college.hostelDetails || {},
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

    if (category && category !== "all" && category !== "All Disciplines") {
      filter.category = category;
    }

    if (query && query.trim() !== "") {
      const regex = new RegExp(query.trim(), "i");
      filter.$or = [
        { title: regex },
        { shortDescription: regex },
        { summary: regex },
        { badge: regex },
        { requiredDegrees: regex },
        { targetExams: regex },
      ];
    }

    const guides = await CareerGuide.find(filter).sort({ createdAt: -1 });

    const formatted = guides.map((g) => ({
      id: g.slug || g._id,
      _id: g._id,
      slug: g.slug,
      title: g.title,
      category: g.category,
      badge: g.badge || g.category,
      image: g.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      readTime: g.readTime || "5 min read",
      author: g.author || "VidyaScope Editorial Team",
      summary: g.summary || g.shortDescription || "",
      shortDescription: g.shortDescription || g.summary || "",
      averageSalary: g.averageSalary,
      eligibility: g.eligibility,
      requiredDegrees: g.requiredDegrees || [],
      targetExams: g.targetExams || [],
      topRecruiters: g.topRecruiters || [],
      roadmapSteps: g.roadmapSteps || [],
      content: g.content || "",
      published: g.published,
      date: g.createdAt
        ? new Date(g.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "Aug 2026",
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
    if (!guide && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      guide = await CareerGuide.findById(slugOrId);
    }

    if (!guide || !guide.published) {
      return res.status(404).json({ success: false, message: "Career roadmap not found." });
    }

    return res.status(200).json({
      success: true,
      guide: {
        id: guide.slug || guide._id,
        _id: guide._id,
        slug: guide.slug,
        title: guide.title,
        category: guide.category,
        badge: guide.badge || guide.category,
        image: guide.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        readTime: guide.readTime || "5 min read",
        author: guide.author || "VidyaScope Editorial Team",
        summary: guide.summary || guide.shortDescription || "",
        shortDescription: guide.shortDescription || guide.summary || "",
        averageSalary: guide.averageSalary,
        eligibility: guide.eligibility,
        requiredDegrees: guide.requiredDegrees || [],
        targetExams: guide.targetExams || [],
        topRecruiters: guide.topRecruiters || [],
        roadmapSteps: guide.roadmapSteps || [],
        content: guide.content || "",
        published: guide.published,
        date: guide.createdAt
          ? new Date(guide.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "Aug 2026",
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

    // Dispatch email notification to student@vidyascope.com (non-blocking)
    sendInquiryNotificationEmail({
      studentName: newInquiry.studentName,
      phone: newInquiry.phone,
      email: newInquiry.email,
      stream: newInquiry.stream,
      targetScore: newInquiry.targetScore,
      preferredLocation: newInquiry.preferredLocation,
      budgetRange: newInquiry.budgetRange,
      admissionYear: newInquiry.admissionYear,
      collegeName: newInquiry.collegeName,
      source: newInquiry.source,
      notes: newInquiry.notes,
    }).catch((err) => console.error("sendInquiryNotificationEmail error:", err));

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

// 7. GET LIVE INTEL ALERTS (Active only for Topbar Ticker)
export const getPublicLiveIntel = async (req, res) => {
  try {
    const alerts = await LiveIntel.find({ isActive: true }).sort({ priority: -1, createdAt: -1 });
    return res.status(200).json({ success: true, alerts });
  } catch (error) {
    console.error("getPublicLiveIntel error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch live intel." });
  }
};

// 8. GET ALL PUBLISHED BLOGS
export const getPublicBlogs = async (req, res) => {
  try {
    const { category, query, limit, exclude } = req.query;
    const filter = { status: "published" };

    if (
      category &&
      category !== "all" &&
      category !== "All" &&
      category !== "All Categories" &&
      category !== "All Articles"
    ) {
      filter.category = new RegExp(`^${category.trim()}$`, "i");
    }

    if (exclude) {
      filter.$and = filter.$and || [];
      filter.$and.push({ slug: { $ne: exclude } });
      if (exclude.match(/^[0-9a-fA-F]{24}$/)) {
        filter.$and.push({ _id: { $ne: exclude } });
      }
    }

    if (query && query.trim() !== "") {
      const regex = new RegExp(query.trim(), "i");
      filter.$or = [
        { title: regex },
        { excerpt: regex },
        { content: regex },
        { tags: regex },
        { "author.name": regex },
      ];
    }

    let queryBuilder = Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 });

    if (limit && !isNaN(Number(limit))) {
      queryBuilder = queryBuilder.limit(Number(limit));
    }

    const blogs = await queryBuilder;

    const formatted = blogs.map((b) => ({
      id: b.slug || b._id,
      _id: b._id,
      slug: b.slug,
      title: b.title,
      category: b.category,
      badge: b.badge,
      coverImage: b.coverImage,
      readTime: b.readTime,
      author: b.author,
      excerpt: b.excerpt,
      content: b.content,
      tags: b.tags || [],
      seoTitle: b.seoTitle || "",
      metaDescription: b.metaDescription || "",
      status: b.status,
      views: b.views || 0,
      publishedAt: b.publishedAt || b.createdAt,
      date: (b.publishedAt || b.createdAt)
        ? new Date(b.publishedAt || b.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "Recent",
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      blogs: formatted,
    });
  } catch (error) {
    console.error("getPublicBlogs error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch blogs." });
  }
};

// 9. GET SINGLE PUBLIC BLOG DETAIL
export const getPublicBlogDetail = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    let blog = await Blog.findOne({ slug: slugOrId, status: "published" });
    if (!blog && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(slugOrId);
    }

    if (!blog || blog.status !== "published") {
      return res.status(404).json({ success: false, message: "Blog article not found." });
    }

    // Increment view count asynchronously
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).catch(() => {});

    return res.status(200).json({
      success: true,
      blog: {
        id: blog.slug || blog._id,
        _id: blog._id,
        slug: blog.slug,
        title: blog.title,
        category: blog.category,
        badge: blog.badge,
        coverImage: blog.coverImage,
        readTime: blog.readTime,
        author: blog.author,
        excerpt: blog.excerpt,
        content: blog.content,
        tags: blog.tags || [],
        seoTitle: blog.seoTitle || "",
        metaDescription: blog.metaDescription || "",
        status: blog.status,
        views: (blog.views || 0) + 1,
        publishedAt: blog.publishedAt || blog.createdAt,
        date: (blog.publishedAt || blog.createdAt)
          ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "Recent",
      },
    });
  } catch (error) {
    console.error("getPublicBlogDetail error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch blog details." });
  }
};

