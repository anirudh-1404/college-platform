import { College } from "../models/College.js";
import { AuditLog } from "../models/AuditLog.js";
import { Inquiry } from "../models/Inquiry.js";

// 1. GET COLLEGE PROFILE (For Authenticated College Representative)
export const getMyCollegeProfile = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    if (!collegeId) {
      return res.status(404).json({ success: false, message: "No college associated with this account." });
    }

    let college = await College.findOne({ slug: collegeId });
    if (!college) {
      // Try by ID or Name
      college = await College.findOne({ name: req.user.collegeName });
    }

    if (!college) {
      return res.status(404).json({ success: false, message: "College profile not found." });
    }

    return res.status(200).json({ success: true, college });
  } catch (error) {
    console.error("getMyCollegeProfile error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch college profile." });
  }
};

// 2. UPDATE COLLEGE PROFILE (10-Step CMS Saving)
export const updateCollegeProfile = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const updates = req.body;

    let college = await College.findOne({ slug: collegeId });
    if (!college) {
      college = await College.findOne({ name: req.user.collegeName });
    }

    if (!college) {
      return res.status(404).json({ success: false, message: "College profile not found." });
    }

    // If profile is under review, do not allow edits
    if (college.profileStatus === "under_review" && req.user.role === "college_admin") {
      return res.status(403).json({ success: false, message: "Profile is currently locked under editorial review." });
    }

    // Merge updates
    Object.keys(updates).forEach((key) => {
      if (key !== "_id" && key !== "slug") {
        college.set(key, updates[key], { strict: false });
        college[key] = updates[key];
        college.markModified(key);
      }
    });

    await college.save();

    return res.status(200).json({
      success: true,
      message: "College profile saved successfully.",
      college,
    });
  } catch (error) {
    console.error("updateCollegeProfile error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update college profile." });
  }
};

// 3. SUBMIT FOR APPROVAL
export const submitForApproval = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    let college = await College.findOne({ slug: collegeId });
    if (!college) {
      college = await College.findOne({ name: req.user.collegeName });
    }

    if (!college) {
      return res.status(404).json({ success: false, message: "College profile not found." });
    }

    college.profileStatus = "under_review";
    college.submittedAt = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await college.save();

    await AuditLog.create({
      adminUser: req.user.name,
      action: "Profile Submitted for Review",
      target: college.name,
      details: "Representative submitted complete 10-step profile for editorial verification.",
      type: "review",
    });

    return res.status(200).json({
      success: true,
      message: "Profile submitted for approval successfully.",
      college,
    });
  } catch (error) {
    console.error("submitForApproval error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit profile for review." });
  }
};

// 4. GET STUDENT LEADS FOR THIS COLLEGE
export const getCollegeLeads = async (req, res) => {
  try {
    const collegeId = req.user?.collegeId;
    const collegeName = req.user?.collegeName;

    const orClauses = [];
    if (collegeId) orClauses.push({ collegeId: collegeId });
    if (collegeName) orClauses.push({ collegeName: new RegExp(`^${collegeName.trim()}$`, "i") });

    if (orClauses.length === 0) {
      return res.status(200).json({
        success: true,
        leads: [],
        count: 0,
      });
    }

    const leads = await Inquiry.find({ $or: orClauses }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leads,
      count: leads.length,
    });
  } catch (error) {
    console.error("getCollegeLeads error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch student leads." });
  }
};
