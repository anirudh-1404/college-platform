import mongoose from "mongoose";
import { User } from "../models/User.js";
import { College } from "../models/College.js";
import { Registration } from "../models/Registration.js";
import { AuditLog } from "../models/AuditLog.js";
import { CareerGuide } from "../models/CareerGuide.js";
import { Exam } from "../models/Exam.js";
import { Inquiry } from "../models/Inquiry.js";
import { LiveIntel } from "../models/LiveIntel.js";
import { Blog } from "../models/Blog.js";

// 1. ANALYTICS METRICS
export const getAdminAnalytics = async (req, res) => {
  try {
    const totalColleges = await College.countDocuments();
    const publishedProfiles = await College.countDocuments({ profileStatus: "published" });
    const underReviewProfiles = await College.countDocuments({ profileStatus: "under_review" });
    const changesRequestedProfiles = await College.countDocuments({ profileStatus: "changes_requested" });

    const pendingRegistrations = await Registration.countDocuments({ status: "pending" });
    const approvedRegistrations = await Registration.countDocuments({ status: "approved" });

    const totalAdmins = await User.countDocuments({ role: { $in: ["admin", "super_admin"] } });

    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: "new" });

    return res.status(200).json({
      success: true,
      analytics: {
        totalColleges,
        publishedProfiles,
        underReviewProfiles,
        changesRequestedProfiles,
        pendingRegistrations,
        approvedRegistrations,
        totalUsers: totalAdmins,
        totalInquiries,
        newInquiries,
      },
    });
  } catch (error) {
    console.error("getAdminAnalytics error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch analytics." });
  }
};

// 2. REGISTRATIONS MANAGEMENT
export const getRegistrations = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== "all" ? { status } : {};
    const registrations = await Registration.find(query).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, registrations });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch registrations." });
  }
};

export const approveRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found." });
    }

    registration.status = "approved";
    registration.notes = "Approved by VidyaScope Compliance Desk";
    await registration.save();

    // Activate User Account
    const user = await User.findOne({ email: registration.email });
    if (user) {
      user.status = "approved";
      user.rejectionReason = null;
      await user.save();
    }

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Registration Approved",
      target: registration.collegeName,
      details: "Institution accreditation authenticated. Granted dashboard portal access.",
      type: "approval",
    });

    return res.status(200).json({
      success: true,
      message: "Registration approved successfully.",
      registration,
    });
  } catch (error) {
    console.error("approveRegistration error:", error);
    return res.status(500).json({ success: false, message: "Failed to approve registration." });
  }
};

export const rejectRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found." });
    }

    registration.status = "rejected";
    registration.notes = reason || "Document validation failed";
    await registration.save();

    // Reject User Account
    const user = await User.findOne({ email: registration.email });
    if (user) {
      user.status = "rejected";
      user.rejectionReason = reason || "Registration rejected by Admin verification team.";
      await user.save();
    }

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Registration Rejected",
      target: registration.collegeName,
      details: `Rejected: ${reason || "Document validation failed"}`,
      type: "rejection",
    });

    return res.status(200).json({
      success: true,
      message: "Registration rejected.",
      registration,
    });
  } catch (error) {
    console.error("rejectRegistration error:", error);
    return res.status(500).json({ success: false, message: "Failed to reject registration." });
  }
};

// 3. COLLEGE PROFILES CMS REVIEW
export const getAllProfiles = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== "all" ? { profileStatus: status } : {};
    const colleges = await College.find(query).sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, profiles: colleges });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch college profiles." });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = decodeURIComponent(id || "").trim();
    let college = null;
    if (mongoose.Types.ObjectId.isValid(cleanId)) {
      college = await College.findById(cleanId);
    }
    if (!college) {
      college = await College.findOne({ slug: cleanId.toLowerCase() });
    }
    if (!college) {
      college = await College.findOne({ slug: cleanId });
    }
    if (!college) {
      college = await College.findOne({ name: cleanId });
    }
    if (!college) {
      college = await College.findOne({
        $or: [
          { slug: { $regex: new RegExp(`^${cleanId}$`, "i") } },
          { name: { $regex: new RegExp(`^${cleanId}$`, "i") } },
        ],
      });
    }

    if (!college) {
      return res.status(404).json({ success: false, message: "College profile not found." });
    }

    return res.status(200).json({ success: true, profile: college });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch college profile." });
  }
};

export const approveAndPublishProfile = async (req, res) => {
  try {
    const { id } = req.params;
    let college = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      college = await College.findById(id);
    }
    if (!college) {
      college = await College.findOne({ slug: id });
    }
    if (!college) {
      college = await College.findOne({ name: id });
    }

    if (!college) {
      return res.status(404).json({ success: false, message: "College profile not found." });
    }

    college.profileStatus = "published";
    college.publishedAt = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await college.save();

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Profile Approved & Published",
      target: college.name,
      details: "All 10 sections validated. Profile published live on VidyaScope public discovery platform.",
      type: "published",
    });

    return res.status(200).json({
      success: true,
      message: "Profile approved and published live.",
      college,
    });
  } catch (error) {
    console.error("approveAndPublishProfile error:", error);
    return res.status(500).json({ success: false, message: "Failed to publish profile." });
  }
};

export const requestProfileChanges = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedbackComment } = req.body;

    let college = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      college = await College.findById(id);
    }
    if (!college) {
      college = await College.findOne({ slug: id });
    }
    if (!college) {
      college = await College.findOne({ name: id });
    }

    if (!college) {
      return res.status(404).json({ success: false, message: "College profile not found." });
    }

    const newFeedback = {
      id: `fb_${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      comment: feedbackComment || "Please revise your submitted details.",
      requestedBy: req.user.name || "VidyaScope Editorial Officer",
      resolved: false,
    };

    college.profileStatus = "changes_requested";
    college.adminFeedback.unshift(newFeedback);
    await college.save();

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Changes Requested",
      target: college.name,
      details: `Editorial note sent: "${feedbackComment}"`,
      type: "changes_requested",
    });

    return res.status(200).json({
      success: true,
      message: "Revision feedback sent to college dashboard.",
      college,
    });
  } catch (error) {
    console.error("requestProfileChanges error:", error);
    return res.status(500).json({ success: false, message: "Failed to request changes." });
  }
};

export const unpublishProfile = async (req, res) => {
  try {
    const { id } = req.params;
    let college = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      college = await College.findById(id);
    }
    if (!college) {
      college = await College.findOne({ slug: id });
    }
    if (!college) {
      college = await College.findOne({ name: id });
    }

    if (!college) {
      return res.status(404).json({ success: false, message: "College profile not found." });
    }

    college.profileStatus = "draft";
    await college.save();

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Profile Unpublished",
      target: college.name,
      details: "Profile withdrawn from live directory and reverted to draft.",
      type: "unpublish",
    });

    return res.status(200).json({
      success: true,
      message: "Profile reverted to draft state.",
      college,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to unpublish profile." });
  }
};

// 3.5 UPDATE COLLEGE PROFILE DETAILS (BY ADMIN)
export const updateCollegeByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = decodeURIComponent(id || "").trim();
    const updates = req.body;

    let college = null;
    if (mongoose.Types.ObjectId.isValid(cleanId)) {
      college = await College.findById(cleanId);
    }
    if (!college) {
      college = await College.findOne({ slug: cleanId.toLowerCase() });
    }
    if (!college) {
      college = await College.findOne({ slug: cleanId });
    }
    if (!college) {
      college = await College.findOne({ name: cleanId });
    }
    if (!college) {
      college = await College.findOne({
        $or: [
          { slug: { $regex: new RegExp(`^${cleanId}$`, "i") } },
          { name: { $regex: new RegExp(`^${cleanId}$`, "i") } },
        ],
      });
    }

    if (!college) {
      return res.status(404).json({ success: false, message: "College profile not found." });
    }

    // Merge updates
    Object.keys(updates).forEach((key) => {
      if (key !== "_id" && key !== "slug") {
        college.set(key, updates[key], { strict: false });
        college[key] = updates[key];
        college.markModified(key);
      }
    });

    // Keep nested and flat fields synced
    if (updates.city || updates.state) {
      if (!college.locationContact) college.locationContact = {};
      if (updates.city) college.locationContact.city = updates.city;
      if (updates.state) college.locationContact.state = updates.state;
      college.location = `${college.locationContact.city || updates.city || ""}${
        (college.locationContact.city || updates.city) && (college.locationContact.state || updates.state) ? ", " : ""
      }${college.locationContact.state || updates.state || "India"}`;
      college.markModified("locationContact");
      college.markModified("location");
    }

    if (updates.nirfRank !== undefined) {
      if (!college.rankings) college.rankings = {};
      college.rankings.nirfRank = Number(updates.nirfRank);
      college.nirfRank = Number(updates.nirfRank);
      college.markModified("rankings");
    }

    if (updates.avgPackage) {
      if (!college.placements) college.placements = {};
      college.placements.avgPackage = updates.avgPackage;
      college.avgPackage = updates.avgPackage;
      college.markModified("placements");
    }

    if (updates.highestPackage) {
      if (!college.placements) college.placements = {};
      college.placements.highestDomestic = updates.highestPackage;
      college.highestPackage = updates.highestPackage;
      college.markModified("placements");
    }

    if (updates.placementPercent !== undefined) {
      if (!college.placements) college.placements = {};
      college.placements.placementRate = Number(updates.placementPercent);
      college.placementPercent = Number(updates.placementPercent);
      college.markModified("placements");
    }

    await college.save();

    await AuditLog.create({
      adminUser: req.user.name,
      action: "College Details Updated",
      target: college.name,
      details: `Administrator updated institutional details for ${college.name}.`,
      type: "edit",
    });

    return res.status(200).json({
      success: true,
      message: "College profile updated successfully by admin.",
      college,
    });
  } catch (error) {
    console.error("updateCollegeByAdmin error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update college." });
  }
};

// 4. PLATFORM-MANAGED DATA (Ratings, Pros/Cons)
export const updatePlatformData = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, reviewsCount, prosAndCons, similarColleges } = req.body;

    let college = await College.findById(id);
    if (!college) {
      college = await College.findOne({ slug: id });
    }

    if (!college) {
      return res.status(404).json({ success: false, message: "College profile not found." });
    }

    if (rating !== undefined) college.rating = rating;
    if (reviewsCount !== undefined) college.reviewsCount = reviewsCount;
    if (prosAndCons) college.prosAndCons = prosAndCons;
    if (similarColleges) college.similarColleges = similarColleges;

    await college.save();

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Platform Data Updated",
      target: college.name,
      details: "Updated platform rating, review counts, or verified pros/cons.",
      type: "platform_update",
    });

    return res.status(200).json({
      success: true,
      message: "Platform data updated successfully.",
      college,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update platform data." });
  }
};

// 5. ADMIN USERS MANAGEMENT (Name, Email, Password, Role: Admin)
export const getAdminUsers = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ["admin", "super_admin"] } }).select("-password");
    return res.status(200).json({ success: true, users: admins });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch admin users." });
  }
};

export const addAdminUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill Name, Email, and Password." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    const newAdmin = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "admin",
      status: "active",
      designation: "Administrator",
    });

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Admin User Added",
      target: name,
      details: `Created admin account for ${email}.`,
      type: "user_created",
    });

    return res.status(201).json({
      success: true,
      message: "Admin user created successfully.",
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: "Admin",
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error("addAdminUser error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to add admin user." });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin user not found." });
    }

    await User.findByIdAndDelete(id);

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Admin User Removed",
      target: admin.name,
      details: `Deleted admin account (${admin.email}).`,
      type: "user_deleted",
    });

    return res.status(200).json({ success: true, message: "Admin user deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete admin user." });
  }
};

// 6. AUDIT LOGS
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ success: true, auditLogs: logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch audit logs." });
  }
};

// 7. CAREER GUIDES MANAGEMENT (Roadmaps)
export const getAdminCareerGuides = async (req, res) => {
  try {
    const guides = await CareerGuide.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, guides });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch career guides." });
  }
};

export const createAdminCareerGuide = async (req, res) => {
  try {
    const {
      title,
      category,
      badge,
      image,
      readTime,
      author,
      summary,
      shortDescription,
      averageSalary,
      eligibility,
      requiredDegrees,
      targetExams,
      topRecruiters,
      roadmapSteps,
      content,
      published,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Career title is required." });
    }

    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let slug = baseSlug;
    const existing = await CareerGuide.findOne({ slug });
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newGuide = await CareerGuide.create({
      title: title.trim(),
      slug,
      category: category || "Engineering & Technology",
      badge: badge || "",
      image: image || "",
      readTime: readTime || "5 min read",
      author: author || "VidyaScope Editorial Team",
      summary: summary || shortDescription || "",
      shortDescription: shortDescription || summary || "",
      averageSalary: averageSalary || "₹12 - 25 LPA",
      eligibility: eligibility || "10+2 with relevant subjects",
      requiredDegrees: requiredDegrees || [],
      targetExams: targetExams || [],
      topRecruiters: topRecruiters || [],
      roadmapSteps: roadmapSteps || [],
      content: content || "",
      published: published !== undefined ? published : true,
    });

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Career Roadmap Created",
      target: newGuide.title,
      details: `Created new career roadmap under ${newGuide.category}.`,
      type: "career_created",
    });

    return res.status(201).json({
      success: true,
      message: "Career roadmap created successfully.",
      guide: newGuide,
    });
  } catch (error) {
    console.error("createAdminCareerGuide error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create career guide." });
  }
};

export const updateAdminCareerGuide = async (req, res) => {
  try {
    const { id } = req.params;
    let guide = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      guide = await CareerGuide.findByIdAndUpdate(id, req.body, { new: true });
    }
    if (!guide) {
      guide = await CareerGuide.findOneAndUpdate({ slug: id }, req.body, { new: true });
    }

    if (!guide) {
      return res.status(404).json({ success: false, message: "Career roadmap not found." });
    }

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Career Roadmap Updated",
      target: guide.title,
      details: `Updated roadmap details for ${guide.title}.`,
      type: "career_updated",
    });

    return res.status(200).json({
      success: true,
      message: "Career roadmap updated successfully.",
      guide,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update career guide." });
  }
};

export const deleteAdminCareerGuide = async (req, res) => {
  try {
    const { id } = req.params;
    let guide = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      guide = await CareerGuide.findByIdAndDelete(id);
    }
    if (!guide) {
      guide = await CareerGuide.findOneAndDelete({ slug: id });
    }

    if (!guide) {
      return res.status(404).json({ success: false, message: "Career roadmap not found." });
    }

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Career Roadmap Deleted",
      target: guide.title,
      details: `Deleted career roadmap (${guide.title}).`,
      type: "career_deleted",
    });

    return res.status(200).json({ success: true, message: "Career roadmap deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete career guide." });
  }
};

// 8. ENTRANCE EXAMS MANAGEMENT
export const getAdminExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, exams });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch exams." });
  }
};

export const createAdminExam = async (req, res) => {
  try {
    const {
      name,
      shortName,
      category,
      conductingBody,
      level,
      mode,
      frequency,
      duration,
      totalMarks,
      eligibility,
      examDates,
      targetCollegesCount,
      overview,
      syllabusHighlights,
      published,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Exam name is required." });
    }

    const baseSlug = (shortName || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let slug = baseSlug;
    const existing = await Exam.findOne({ slug });
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newExam = await Exam.create({
      name: name.trim(),
      shortName: shortName?.trim() || name.trim().slice(0, 10),
      slug,
      category: category || "engineering",
      conductingBody: conductingBody || "National Testing Agency (NTA)",
      level: level || "National Level",
      mode: mode || "Computer Based Test (CBT)",
      frequency: frequency || "Once a year",
      duration: duration || "180 Minutes (3 Hours)",
      totalMarks: totalMarks || "300 Marks",
      eligibility: eligibility || "10+2 with relevant subjects",
      examDates: examDates || {
        applicationStart: "November 2025",
        applicationEnd: "January 2026",
        admitCardDate: "April 2026",
        examDate: "May 2026",
        resultDate: "June 2026",
      },
      targetCollegesCount: targetCollegesCount || "Top National Universities & Institutes",
      overview: overview || "",
      syllabusHighlights: syllabusHighlights || [],
      published: published !== undefined ? published : true,
    });

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Entrance Exam Created",
      target: newExam.name,
      details: `Created new entrance exam record under ${newExam.category}.`,
      type: "exam_created",
    });

    return res.status(201).json({
      success: true,
      message: "Entrance exam created successfully.",
      exam: newExam,
    });
  } catch (error) {
    console.error("createAdminExam error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create exam." });
  }
};

export const updateAdminExam = async (req, res) => {
  try {
    const { id } = req.params;
    let exam = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      exam = await Exam.findByIdAndUpdate(id, req.body, { new: true });
    }
    if (!exam) {
      exam = await Exam.findOneAndUpdate({ slug: id }, req.body, { new: true });
    }

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found." });
    }

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Entrance Exam Updated",
      target: exam.name,
      details: `Updated details for ${exam.name}.`,
      type: "exam_updated",
    });

    return res.status(200).json({
      success: true,
      message: "Exam updated successfully.",
      exam,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update exam." });
  }
};

export const deleteAdminExam = async (req, res) => {
  try {
    const { id } = req.params;
    let exam = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      exam = await Exam.findByIdAndDelete(id);
    }
    if (!exam) {
      exam = await Exam.findOneAndDelete({ slug: id });
    }

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found." });
    }

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Entrance Exam Deleted",
      target: exam.name,
      details: `Deleted entrance exam record (${exam.name}).`,
      type: "exam_deleted",
    });

    return res.status(200).json({ success: true, message: "Entrance exam deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete exam." });
  }
};

// 7. INQUIRIES & STUDENT LEADS MANAGEMENT
export const getAdminInquiries = async (req, res) => {
  try {
    const { status, stream, search } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (stream && stream !== "all") {
      filter.stream = stream;
    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { studentName: regex },
        { phone: regex },
        { email: regex },
        { collegeName: regex },
      ];
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    const counts = {
      all: await Inquiry.countDocuments(),
      new: await Inquiry.countDocuments({ status: "new" }),
      contacted: await Inquiry.countDocuments({ status: "contacted" }),
      in_progress: await Inquiry.countDocuments({ status: "in_progress" }),
      enrolled: await Inquiry.countDocuments({ status: "enrolled" }),
      closed: await Inquiry.countDocuments({ status: "closed" }),
    };

    return res.status(200).json({
      success: true,
      inquiries,
      counts,
    });
  } catch (error) {
    console.error("getAdminInquiries error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch student inquiries." });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, counselorNotes, assignedCounselor } = req.body;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    if (status) inquiry.status = status;
    if (counselorNotes !== undefined) inquiry.counselorNotes = counselorNotes;
    if (assignedCounselor) inquiry.assignedCounselor = assignedCounselor;

    await inquiry.save();

    await AuditLog.create({
      adminUser: req.user?.name || "Admin",
      action: "Inquiry Status Updated",
      target: `${inquiry.studentName} (${inquiry.phone})`,
      details: `Updated inquiry status to "${inquiry.status}".`,
      type: "inquiry_updated",
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry updated successfully.",
      inquiry,
    });
  } catch (error) {
    console.error("updateInquiryStatus error:", error);
    return res.status(500).json({ success: false, message: "Failed to update inquiry." });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    await AuditLog.create({
      adminUser: req.user?.name || "Admin",
      action: "Inquiry Deleted",
      target: `${inquiry.studentName} (${inquiry.phone})`,
      details: `Deleted student counseling inquiry.`,
      type: "inquiry_deleted",
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully.",
    });
  } catch (error) {
    console.error("deleteInquiry error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete inquiry." });
  }
};

// 10. LIVE INTEL TICKER MANAGEMENT (CRUD)
export const getAdminLiveIntel = async (req, res) => {
  try {
    const alerts = await LiveIntel.find().sort({ priority: -1, createdAt: -1 });
    return res.status(200).json({ success: true, alerts });
  } catch (error) {
    console.error("getAdminLiveIntel error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch live intel alerts." });
  }
};

export const createAdminLiveIntel = async (req, res) => {
  try {
    const { text, category, link, isActive, priority } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Intel headline/text is required." });
    }

    const alert = await LiveIntel.create({
      text: text.trim(),
      category: category ? category.trim() : "LIVE INTEL",
      link: link ? link.trim() : "",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      priority: priority !== undefined ? Number(priority) : 0,
    });

    await AuditLog.create({
      adminUser: req.user?.name || "Admin",
      action: "Live Intel Alert Created",
      target: alert.text.slice(0, 50),
      details: `Created new live intel item with category: ${alert.category}`,
      type: "live_intel_created",
    });

    return res.status(201).json({
      success: true,
      message: "Live intel alert created successfully.",
      alert,
    });
  } catch (error) {
    console.error("createAdminLiveIntel error:", error);
    return res.status(500).json({ success: false, message: "Failed to create live intel alert." });
  }
};

export const updateAdminLiveIntel = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, category, link, isActive, priority } = req.body;

    const alert = await LiveIntel.findById(id);
    if (!alert) {
      return res.status(404).json({ success: false, message: "Live intel alert not found." });
    }

    if (text !== undefined) alert.text = text.trim();
    if (category !== undefined) alert.category = category.trim();
    if (link !== undefined) alert.link = link.trim();
    if (isActive !== undefined) alert.isActive = Boolean(isActive);
    if (priority !== undefined) alert.priority = Number(priority);

    await alert.save();

    await AuditLog.create({
      adminUser: req.user?.name || "Admin",
      action: "Live Intel Alert Updated",
      target: alert.text.slice(0, 50),
      details: `Updated live intel alert #${alert._id}`,
      type: "live_intel_updated",
    });

    return res.status(200).json({
      success: true,
      message: "Live intel alert updated successfully.",
      alert,
    });
  } catch (error) {
    console.error("updateAdminLiveIntel error:", error);
    return res.status(500).json({ success: false, message: "Failed to update live intel alert." });
  }
};

export const toggleAdminLiveIntel = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await LiveIntel.findById(id);
    if (!alert) {
      return res.status(404).json({ success: false, message: "Live intel alert not found." });
    }

    alert.isActive = !alert.isActive;
    await alert.save();

    return res.status(200).json({
      success: true,
      message: `Alert is now ${alert.isActive ? "active" : "inactive"}.`,
      alert,
    });
  } catch (error) {
    console.error("toggleAdminLiveIntel error:", error);
    return res.status(500).json({ success: false, message: "Failed to toggle live intel status." });
  }
};

export const deleteAdminLiveIntel = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await LiveIntel.findByIdAndDelete(id);
    if (!alert) {
      return res.status(404).json({ success: false, message: "Live intel alert not found." });
    }

    await AuditLog.create({
      adminUser: req.user?.name || "Admin",
      action: "Live Intel Alert Deleted",
      target: alert.text.slice(0, 50),
      details: `Deleted live intel alert: ${alert.text}`,
      type: "live_intel_deleted",
    });

    return res.status(200).json({
      success: true,
      message: "Live intel alert deleted successfully.",
    });
  } catch (error) {
    console.error("deleteAdminLiveIntel error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete live intel alert." });
  }
};

// 12. BLOGS MANAGEMENT (Editorial & Student Articles)
export const getAdminBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("getAdminBlogs error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch blogs." });
  }
};

export const createAdminBlog = async (req, res) => {
  try {
    const {
      title,
      category,
      badge,
      coverImage,
      readTime,
      authorName,
      authorRole,
      authorAvatar,
      excerpt,
      content,
      tags,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Blog title is required." });
    }
    if (!excerpt || !excerpt.trim()) {
      return res.status(400).json({ success: false, message: "Excerpt / summary is required." });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Blog content is required." });
    }

    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let slug = baseSlug;
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newBlog = await Blog.create({
      title: title.trim(),
      slug,
      category: category || "Admissions & Cutoffs",
      badge: badge || "",
      coverImage: coverImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
      readTime: readTime || "5 min read",
      author: {
        name: authorName || "VidyaScope Editorial Team",
        role: authorRole || "Higher Education Analyst",
        avatar: authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      },
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      status: status || "published",
      publishedAt: status === "draft" ? null : new Date(),
    });

    await AuditLog.create({
      adminUser: req.user?.name || "Admin",
      action: "New Blog Created",
      target: newBlog.title,
      details: `Created blog article: ${newBlog.title} (${newBlog.category})`,
      type: "blog_created",
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      blog: newBlog,
    });
  } catch (error) {
    console.error("createAdminBlog error:", error);
    return res.status(500).json({ success: false, message: "Failed to create blog.", error: error.message });
  }
};

export const updateAdminBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatePayload = { ...req.body };

    if (updatePayload.tags && typeof updatePayload.tags === "string") {
      updatePayload.tags = updatePayload.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    if (updatePayload.authorName || updatePayload.authorRole || updatePayload.authorAvatar) {
      updatePayload.author = {
        name: updatePayload.authorName || "VidyaScope Editorial Team",
        role: updatePayload.authorRole || "Higher Education Analyst",
        avatar: updatePayload.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      };
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    await AuditLog.create({
      adminUser: req.user?.name || "Admin",
      action: "Blog Updated",
      target: updatedBlog.title,
      details: `Updated blog article: ${updatedBlog.title}`,
      type: "blog_updated",
    });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("updateAdminBlog error:", error);
    return res.status(500).json({ success: false, message: "Failed to update blog." });
  }
};

export const deleteAdminBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    await AuditLog.create({
      adminUser: req.user?.name || "Admin",
      action: "Blog Deleted",
      target: deletedBlog.title,
      details: `Deleted blog article: ${deletedBlog.title}`,
      type: "blog_deleted",
    });

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error("deleteAdminBlog error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete blog." });
  }
};

