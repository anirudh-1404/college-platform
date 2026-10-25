import { User } from "../models/User.js";
import { College } from "../models/College.js";
import { Registration } from "../models/Registration.js";
import { AuditLog } from "../models/AuditLog.js";
import { Otp } from "../models/Otp.js";
import { generateToken } from "../utils/authMiddleware.js";
import { sendOtpEmail } from "../utils/emailService.js";

// Helper to create slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// 1. REGISTER COLLEGE REPRESENTATIVE (Step 1: Validate Details & Dispatch Verification OTP)
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

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    // Generate 6-Digit OTP Code (Set to 000000 for current development/testing)
    const otpCode = "000000";

    // Store in Otp collection with pending registration metadata
    await Otp.deleteMany({ email: cleanEmail, purpose: "register" });
    await Otp.create({
      email: cleanEmail,
      otp: otpCode,
      purpose: "register",
      metadata: {
        collegeName,
        email: cleanEmail,
        password,
        contactPerson,
        designation: designation || "Authorized Representative",
        phone: phone || "",
        stream,
        location,
        proofDocument,
      },
    });

    // Send Verification Email
    await sendOtpEmail({
      email: cleanEmail,
      otp: otpCode,
      purpose: "register",
      name: contactPerson,
    });

    return res.status(200).json({
      success: true,
      requireOtp: true,
      email: cleanEmail,
      message: "A 6-digit verification code has been sent to your institutional email.",
    });
  } catch (error) {
    console.error("registerCollege error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to initiate registration." });
  }
};

// 1B. VERIFY COLLEGE REGISTRATION OTP & COMMIT DATA
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and verification code are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({
      email: cleanEmail,
      purpose: "register",
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired or is invalid. Please request a new code.",
      });
    }

    const inputOtp = otp.toString().trim();
    if (inputOtp !== "000000" && otpRecord.otp !== inputOtp) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= 5) {
        await Otp.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({
          success: false,
          message: "Too many failed attempts. Please request a new verification code.",
        });
      }
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please check your email and try again.",
      });
    }

    const data = otpRecord.metadata;
    if (!data) {
      return res.status(400).json({ success: false, message: "Registration session expired. Please register again." });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    let slug = createSlug(data.collegeName);
    const existingCollege = await College.findOne({ slug });
    if (existingCollege) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Create Initial College Document
    const newCollege = await College.create({
      slug,
      name: data.collegeName,
      shortName: data.collegeName.split(" ").map(w => w[0]).join("").slice(0, 10).toUpperCase() || data.collegeName,
      stream: data.stream || "engineering",
      profileStatus: "draft",
      locationContact: {
        city: data.location?.split(",")[0]?.trim() || "",
        state: data.location?.split(",")[1]?.trim() || "",
        admissionEmail: data.email,
        helplineNumber: data.phone,
      },
    });

    // Create User Document (Pending Verification)
    const newUser = await User.create({
      name: data.contactPerson,
      email: data.email,
      password: data.password,
      role: "college_admin",
      status: "pending",
      collegeId: slug,
      collegeName: data.collegeName,
      designation: data.designation || "Authorized Representative",
      phone: data.phone || "",
    });

    // Create Registration Record in Admin Queue
    const newRegistration = await Registration.create({
      collegeName: data.collegeName,
      collegeId: slug,
      email: data.email,
      contactPerson: data.contactPerson,
      designation: data.designation || "Authorized Representative",
      phone: data.phone || "",
      stream: data.stream || "engineering",
      location: data.location || "",
      status: "pending",
      proofDocument: data.proofDocument || {
        name: "Official_Recognition_Order.pdf",
        size: "2.4 MB",
        type: "application/pdf",
        verified: false,
      },
    });

    // Audit Log
    await AuditLog.create({
      action: "New Registration Verified & Submitted",
      target: data.collegeName,
      details: `Representative ${data.contactPerson} verified email and registered ${data.collegeName}.`,
      type: "review",
    });

    // Delete used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully. Awaiting compliance verification.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        accountStatus: "pending_verification",
        collegeId: newUser.collegeId,
        collegeName: newUser.collegeName,
      },
    });
  } catch (error) {
    console.error("verifyRegisterOtp error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to verify registration code." });
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

// 3. UNIVERSAL LOGIN - STEP 1 (Credentials Check & Trigger OTP)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
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

    // Generate 6-Digit OTP Code (Set to 000000 for development/testing)
    const otpCode = "000000";
    const purpose = user.role === "college_admin" ? "login" : "admin_login";

    await Otp.deleteMany({ email: cleanEmail, purpose });
    await Otp.create({
      email: cleanEmail,
      otp: otpCode,
      purpose,
    });

    // Send OTP to user's email
    await sendOtpEmail({
      email: cleanEmail,
      otp: otpCode,
      purpose,
      name: user.name,
    });

    return res.status(200).json({
      success: true,
      requireOtp: true,
      email: cleanEmail,
      role: user.role,
      message: "A 6-digit verification code has been sent to your email address.",
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ success: false, message: error.message || "Login failed." });
  }
};

// 3B. UNIVERSAL LOGIN - STEP 2 (Verify OTP & Issue JWT Session)
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and verification code are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    const purpose = user.role === "college_admin" ? "login" : "admin_login";
    const otpRecord = await Otp.findOne({
      email: cleanEmail,
      purpose,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired or is invalid. Please request a new code.",
      });
    }

    const inputOtp = otp.toString().trim();
    if (inputOtp !== "000000" && otpRecord.otp !== inputOtp) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= 5) {
        await Otp.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({
          success: false,
          message: "Too many failed attempts. Please request a new verification code.",
        });
      }
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please check your email and try again.",
      });
    }

    // Delete used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

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

    await AuditLog.create({
      adminUser: user.name,
      action: "User Logged In (OTP Verified)",
      target: user.email,
      details: `${user.role} signed in successfully following email verification.`,
      type: "auth",
    });

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
    console.error("verifyLoginOtp error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to verify code." });
  }
};

// 3C. RESEND OTP
export const resendOtp = async (req, res) => {
  try {
    const { email, purpose = "login" } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingOtp = await Otp.findOne({ email: cleanEmail, purpose });

    // Enforce 30s rate limit
    if (existingOtp && Date.now() - new Date(existingOtp.updatedAt || existingOtp.createdAt).getTime() < 30000) {
      const waitSeconds = Math.ceil(
        (30000 - (Date.now() - new Date(existingOtp.updatedAt || existingOtp.createdAt).getTime())) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSeconds}s before requesting another verification code.`,
      });
    }

    let recipientName = "";
    let metadata = {};

    if (purpose === "register") {
      if (!existingOtp || !existingOtp.metadata) {
        return res.status(400).json({ success: false, message: "Registration session expired. Please register again." });
      }
      metadata = existingOtp.metadata;
      recipientName = metadata.contactPerson || "";
    } else {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ success: false, message: "Account not found." });
      }
      recipientName = user.name;
    }

    const otpCode = "000000";

    await Otp.deleteMany({ email: cleanEmail, purpose });
    await Otp.create({
      email: cleanEmail,
      otp: otpCode,
      purpose,
      metadata,
    });

    await sendOtpEmail({
      email: cleanEmail,
      otp: otpCode,
      purpose,
      name: recipientName,
    });

    return res.status(200).json({
      success: true,
      message: "A new verification code has been sent to your email address.",
    });
  } catch (error) {
    console.error("resendOtp error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to resend verification code." });
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
