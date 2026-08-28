import { User } from "../models/User.js";
import { College } from "../models/College.js";
import { Registration } from "../models/Registration.js";
import { AuditLog } from "../models/AuditLog.js";

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

export const approveAndPublishProfile = async (req, res) => {
  try {
    const { id } = req.params;
    let college = await College.findById(id);
    if (!college) {
      college = await College.findOne({ slug: id });
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

    let college = await College.findById(id);
    if (!college) {
      college = await College.findOne({ slug: id });
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
    let college = await College.findById(id);
    if (!college) {
      college = await College.findOne({ slug: id });
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
