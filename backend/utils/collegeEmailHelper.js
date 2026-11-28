import { User } from "../models/User.js";
import { Registration } from "../models/Registration.js";
import { AuditLog } from "../models/AuditLog.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates and updates a college_admin user's login email, syncing Registration and AuditLog.
 */
export const updateCollegeAccountEmail = async ({
  user,
  newEmail,
  actorName,
  source = "college_portal",
}) => {
  if (!newEmail || !EMAIL_REGEX.test(newEmail.trim())) {
    const err = new Error("Please enter a valid email address.");
    err.statusCode = 400;
    throw err;
  }

  const cleanNewEmail = newEmail.toLowerCase().trim();
  const oldEmail = user.email;

  if (cleanNewEmail === oldEmail) {
    return { user, oldEmail, newEmail: cleanNewEmail, changed: false };
  }

  const existing = await User.findOne({
    email: cleanNewEmail,
    _id: { $ne: user._id },
  });
  if (existing) {
    const err = new Error("An account with this email already exists.");
    err.statusCode = 400;
    throw err;
  }

  user.email = cleanNewEmail;
  await user.save();

  const regFilter = user.collegeId
    ? { $or: [{ collegeId: user.collegeId }, { email: oldEmail }] }
    : { email: oldEmail };
  await Registration.updateMany(regFilter, { email: cleanNewEmail });

  await AuditLog.create({
    adminUser: actorName || user.name,
    action: "College Login Email Updated",
    target: user.collegeName || cleanNewEmail,
    details: `Login email changed from ${oldEmail} to ${cleanNewEmail} via ${source}.`,
    type: "edit",
  });

  return { user, oldEmail, newEmail: cleanNewEmail, changed: true };
};

