import { User } from "../models/User.js";
import { College } from "../models/College.js";
import { Registration } from "../models/Registration.js";
import { AuditLog } from "../models/AuditLog.js";
import { generateToken } from "../utils/authMiddleware.js";

// Helper to create slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// 1. REGISTER COLLEGE REPRESENTATIVE
export const registerCollege = async (req, res) => {
  try {
    const {
      collegeName,
      email,
      password,
      contactPerson,
      designation,
      phone,
      stream = "engineering",
      location = "",
      proofDocument,
    } = req.body;

    if (!collegeName || !email || !password || !contactPerson) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    let slug = createSlug(collegeName);
    const existingCollege = await College.findOne({ slug });
    if (existingCollege) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Create Initial College Document
    const newCollege = await College.create({
      slug,
      name: collegeName,
      shortName: collegeName.split(" ").map(w => w[0]).join("").slice(0, 10).toUpperCase() || collegeName,
      stream,
      profileStatus: "draft",
      locationContact: {
        city: location.split(",")[0]?.trim() || "",
        state: location.split(",")[1]?.trim() || "",
        admissionEmail: email,
        helplineNumber: phone,
      },
    });

    // Create User Document (Pending Verification)
    const newUser = await User.create({
      name: contactPerson,
      email: email.toLowerCase(),
      password,
      role: "college_admin",
      status: "pending",
      collegeId: slug,
      collegeName,
      designation: designation || "Authorized Representative",
      phone: phone || "",
    });

    // Create Registration Record in Admin Queue
    const newRegistration = await Registration.create({
      collegeName,
      collegeId: slug,
      email: email.toLowerCase(),
      contactPerson,
      designation: designation || "Authorized Representative",
      phone: phone || "",
      stream,
      location,
      status: "pending",
      proofDocument: proofDocument || {
        name: "Official_Recognition_Order.pdf",
        size: "2.4 MB",
        type: "application/pdf",
        verified: false,
      },
    });

    // Audit Log
    await AuditLog.create({
      action: "New Registration Submitted",
      target: collegeName,
      details: `Representative ${contactPerson} registered with official email ${email}.`,
      type: "review",
    });

    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully. Awaiting admin compliance verification.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        collegeId: newUser.collegeId,
        collegeName: newUser.collegeName,
      },
    });
  } catch (error) {
    console.error("registerCollege error:", error);
    return res.status(500).json({ success: false, message: error.message || "Registration failed." });
  }
};

// 2. REGISTER ADMIN (Can be called via Postman or Admin portal)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role = "admin", designation, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill Name, Email, and Password." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    const newAdmin = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role === "super_admin" ? "super_admin" : "admin",
      status: "active",
      designation: designation || "Administrator",
      phone: phone || "",
    });

    await AuditLog.create({
      adminUser: req.user?.name || "System",
      action: "Admin Account Created",
      target: name,
      details: `Created admin account for ${email} with role ${role}.`,
      type: "user_created",
    });

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully.",
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status,
      },
    });
  } catch (error) {
    console.error("registerAdmin error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create admin." });
  }
};

// 3. UNIVERSAL LOGIN (For College Reps & Admins)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Check account status
    if (user.status === "suspended") {
      return res.status(403).json({ success: false, message: "Your account has been suspended by administration." });
    }

    // If college_admin is pending or rejected, return status without error so frontend can render appropriate screen
    if (user.role === "college_admin" && user.status === "pending") {
      return res.status(200).json({
        success: true,
        message: "Account verification pending.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accountStatus: "pending_verification",
          collegeId: user.collegeId,
          collegeName: user.collegeName,
        },
      });
    }

    if (user.role === "college_admin" && user.status === "rejected") {
      return res.status(200).json({
        success: true,
        message: "Registration rejected.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accountStatus: "rejected",
          rejectionReason: user.rejectionReason || "Verification rejected by Admin.",
          collegeId: user.collegeId,
          collegeName: user.collegeName,
        },
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT Token
    const token = generateToken(res, user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: "approved",
        collegeId: user.collegeId,
        collegeName: user.collegeName,
        designation: user.designation,
      },
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ success: false, message: error.message || "Login failed." });
  }
};

// 4. GET CURRENT LOGGED-IN USER
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch user session." });
  }
};

// 5. LOGOUT
export const logout = (req, res) => {
  res.clearCookie("vidyascope_token");
  return res.status(200).json({ success: true, message: "Logged out successfully." });
};
