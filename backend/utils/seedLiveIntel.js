import "dotenv/config";
import mongoose from "mongoose";
import { connectdb } from "../config/db.js";
import { LiveIntel } from "../models/LiveIntel.js";

const initialAlerts = [
  {
    category: "LIVE AUDIT",
    text: "IIT Bombay 2025-26 Median CTC Audited & Verified at ₹21.8 LPA",
    link: "/colleges/iit-bombay",
    priority: 10,
    isActive: true,
  },
  {
    category: "GATEWAY UPDATE",
    text: "JEE Advanced 2026 Examination Schedule & Eligibility Released",
    link: "/exams",
    priority: 9,
    isActive: true,
  },
  {
    category: "COST OF LIVING",
    text: "Updated 4-Year Hostel & Mess Expense Breakdown for 85 Premier Campuses",
    link: "/colleges",
    priority: 8,
    isActive: true,
  },
  {
    category: "MANAGEMENT INTELLIGENCE",
    text: "CAT 2025 Composite Cutoffs & IIM Interview Predictor Live",
    link: "/exams",
    priority: 7,
    isActive: true,
  },
  {
    category: "CONSUMER ADVISORY",
    text: "14 Unaccredited Private Deemed Universities Flagged by Regulatory Audit",
    link: "/colleges",
    priority: 6,
    isActive: true,
  },
];

async function seed() {
  try {
    await connectdb();
    const count = await LiveIntel.countDocuments();
    if (count === 0) {
      await LiveIntel.insertMany(initialAlerts);
      console.log("✅ Seeded initial Live Intel items into database!");
    } else {
      console.log(`ℹ️ Live Intel already has ${count} items. Skipping.`);
    }
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
