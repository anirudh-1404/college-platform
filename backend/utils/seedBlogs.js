import "dotenv/config";
import mongoose from "mongoose";
import { Blog } from "../models/Blog.js";

const blogsToSeed = [
  {
    title: "NIRF Rankings 2026: How to Read Beyond the Promotional Hype",
    slug: "nirf-rankings-2026-how-to-read-beyond-hype",
    category: "Admissions & Cutoffs",
    badge: "Must Read",
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    readTime: "5 min read",
    author: {
      name: "Dr. Arvind Iyer",
      role: "Senior Academic Policy Analyst",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    excerpt: "Every year thousands of students pick colleges solely based on composite NIRF ranks without checking graduation outcomes or faculty ratios. Here is how to evaluate real metrics.",
    content: `
### Why Ranking Composite Scores Can Be Misleading

Every year in June and July, counseling sessions are dominated by a single metric: the National Institutional Ranking Framework (NIRF) rank. While NIRF is India's most credible public ranking system, choosing an institution solely based on a single composite rank can be a serious mistake.

NIRF calculates its scores using five weighted parameters:
1. **Teaching, Learning & Resources (TLR):** 30% weightage
2. **Research and Professional Practice (RPC):** 30% weightage
3. **Graduation Outcomes (GO):** 20% weightage
4. **Outreach and Inclusivity (OI):** 10% weightage
5. **Perception (PR):** 10% weightage

### The Research vs Undergraduate Dilemma

Notice that **30% of the total score** comes from Research and Professional Practice (RPC) — which includes patent filings, PhD publications, and research grant funds. An older research institution may score exceptionally high in RPC because of its post-graduate scholars, while its undergraduate (B.Tech) labs, hostel facilities, and current placement assistance may actually lag behind newer private tech universities.

> "Undergraduate students should look specifically at the Graduation Outcomes (GO) and Median CTC metric rather than the aggregate ranking."

### What You Should Inspect Before Locking Your Choice
- **Median vs Average Package:** Always ask for the *median* salary rather than the average or highest domestic package.
- **Batch Size vs Placement Offers:** If an institute has 3,000 students in CS-related branches, compare how many received Tier-1 product offers vs mass IT recruits.
- **Faculty Student Ratio (FSR):** Check if core branch classes have fewer than 60 students or if lectures are delivered to 200+ batches simultaneously.
    `,
    tags: ["NIRF", "Engineering Admissions", "College Selection"],
    status: "published",
    views: 1240,
    publishedAt: new Date("2026-09-15"),
  },
  {
    title: "Cracking JEE Advanced: The Final 6-Month Focused Problem Solving Plan",
    slug: "cracking-jee-advanced-final-6-month-problem-solving-plan",
    category: "Exam Preparation",
    badge: "Trending",
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    readTime: "7 min read",
    author: {
      name: "Rohan Mukherjee",
      role: "IIT Delhi Alumnus & Mentor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    excerpt: "Moving from 98+ percentile in JEE Main to a sub-3000 rank in JEE Advanced requires an overhaul from speed memorization to deep multi-concept synthesis.",
    content: `
### The Paradigm Shift: JEE Main vs JEE Advanced

JEE Main is a test of speed, breadth, and precision. You have approximately 2 minutes per question across 75 problems. JEE Advanced, on the other hand, is an endurance and conceptual depth test where 50% score often secures an under-2500 All India Rank.

### Phase 1: High-Weightage Multi-Concept Linking (Months 1 - 2)
In Advanced, rarely do you see a pure Mechanics or pure Thermodynamics problem. A typical problem links rotational dynamics with magnetic induction, or organic reaction kinetics with electrochemistry.

- **Physics:** Focus intensely on Electrodynamics, Rotational Mechanics, and Optics.
- **Chemistry:** Organic mechanisms with stereochemistry and Inorganic coordination chemistry.
- **Mathematics:** Integral Calculus, Coordinate Geometry, and Vectors/3D.

### Phase 2: Timed Mock Tests in Exact Slots (Months 3 - 4)
Condition your brain to peak cognitive performance between **9:00 AM – 12:00 PM** and **2:30 PM – 5:30 PM**. Sit for 6-hour continuous mock test simulations every Saturday.

### Phase 3: Error Log Analysis (Months 5 - 6)
Do not solve new unknown question banks in the final month. Instead, review your personal "Mistake Journal". 80% of negative marks in Advanced stem from reading errors in multiple-correct options rather than lack of knowledge.
    `,
    tags: ["JEE Advanced", "IIT Prep", "Study Strategy"],
    status: "published",
    views: 2180,
    publishedAt: new Date("2026-09-20"),
  },
  {
    title: "Tech Placements 2026: Beyond CSE — High Paying Core & Circuit Branches",
    slug: "tech-placements-2026-beyond-cse-high-paying-branches",
    category: "Placement Insights",
    badge: "Exclusive",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    readTime: "6 min read",
    author: {
      name: "Pooja Hegde",
      role: "Head of Campus Talent Acquisition",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    excerpt: "With AI automation reshaping generic software development, specialized branches like VLSI, Robotics, Data Engineering, and Mechatronics are seeing unprecedented salary growth.",
    content: `
### Is CSE Still The Only Branch Worth Choosing?

For the past decade, students flocked to Computer Science & Engineering (CSE) to the point where cutoffs skyrocketed. However, the tech landscape in 2026 is undergoing a major structural shift driven by semiconductor manufacturing, edge AI hardware, and robotics automation.

### 1. Electronics & VLSI Design (Very Large Scale Integration)
With India's Semiconductor Mission (ISM) gaining traction and massive semiconductor fabrication facilities launching in Gujarat and Karnataka, chip design engineers are in historic demand. Starting CTCs for VLSI graduates from top NITs and IIITs now consistently touch ₹18 - 35 LPA.

### 2. Mathematics and Computing (MnC)
MnC blends rigorous theoretical mathematics with computational algorithms. High-Frequency Trading (HFT) firms and quantitative hedge funds recruit almost exclusively from MnC and CSE cohorts, offering the highest packages on Indian campuses (often ₹50 LPA to ₹1.2 Cr+).

### 3. Artificial Intelligence & Data Science
Specialized AI/DS degrees with solid foundations in linear algebra, probability, and GPU parallel computing command higher starting salaries than generic IT programs.

> "Companies no longer pay for basic syntax writing; they pay for deep algorithmic architecture, embedded firmware design, and hardware-software optimization."
    `,
    tags: ["Placements", "Branch Selection", "Engineering Careers"],
    status: "published",
    views: 1890,
    publishedAt: new Date("2026-09-22"),
  },
  {
    title: "Hostel Life 101: Single vs Double Sharing, Hidden Expenses & Campus Realities",
    slug: "hostel-life-101-single-vs-double-sharing-hidden-expenses",
    category: "Campus & Hostel Life",
    badge: "Student Life",
    coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
    readTime: "4 min read",
    author: {
      name: "VidyaScope Campus Ambassadors",
      role: "Student Community Voices",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    },
    excerpt: "Moving into your university hostel is your first real test of independence. From laundry allowances to room allocation rules, here is what college brochures never tell you.",
    content: `
### The First Month Transition

Living away from home for the first time is both liberating and daunting. While college brochures display scenic hostel lawns and spacious bedrooms, daily reality hinges on small operational details that can make or break your academic focus.

### Single vs Double vs Triple Occupancy: Which Should You Pick?
- **First Year (Double / Triple Sharing):** We strongly recommend sharing a room during your first two semesters. Having roommates forces you out of your comfort zone, prevents homesickness, and helps you make lifelong friends quickly.
- **Final Years (Single Occupancy):** Once placement preparation, internships, and competitive exam preparation begin, having a quiet single room with private study space is invaluable.

### The Hidden Costs Checklist
- **Laundry & Ironing:** Monthly dry cleaning or on-campus coin laundry typically costs ₹1,500 – ₹2,500/month.
- **Cooling / Heating Charges:** Many northern universities levy an extra electricity surcharge (₹4,000 – ₹8,000/semester) for desert coolers or heaters.
- **Mess Food Supplements:** Even in top universities, mess food can get repetitive. Budget at least ₹3,000/month for fresh fruit, milk, and healthy evening snacks.
    `,
    tags: ["Hostel Life", "Campus Essentials", "Student Survival"],
    status: "published",
    views: 950,
    publishedAt: new Date("2026-09-24"),
  },
  {
    title: "Direct Admission vs Management Quota: Legal Safeguards & Verification Checklist",
    slug: "direct-admission-vs-management-quota-legal-safeguards",
    category: "Admissions & Cutoffs",
    badge: "Advisory",
    coverImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    readTime: "6 min read",
    author: {
      name: "Adv. Meera Sen",
      role: "Educational Law & Compliance Advisor",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    },
    excerpt: "Unregulated agents often exploit anxious parents during counseling season. Understand official state fee caps, verified institutional seats, and how to avoid fraudulent brokers.",
    content: `
### Protecting Yourself from Admission Fraud

During June, July, and August, search trends for "direct admission" and "management quota" spike across India. Unfortunately, this anxiety is often preyed upon by unaccredited third-party brokers promising confirmed seats at premier colleges.

### The Legal Framework: What Is Allowed?
In India, private unaided professional colleges are legally permitted to allocate a designated percentage of seats (typically 15% to 25%, depending on the state) under the Institutional / Management Quota or NRI Quota:
1. **Fee Regulation:** Every state has an official Fee Regulatory Committee (FRC / Shikshan Shulk Samiti). Colleges cannot legally charge fees higher than the approved government ceiling.
2. **Official Banking Channels Only:** Never transfer money to an individual's personal UPI ID or third-party agency account. All legitimate payments must be drawn in favor of the registered University Trust or College Account.
3. **Written Allotment Order:** Ensure you receive an official stamped provisional admission letter specifying your course, roll number, and fee receipt directly from the college registrar.

> "If an agent promises admission to an IIT, NIT, or central university through a back door, walk away immediately. Admissions to central government institutions are 100% merit-based via central counseling."
    `,
    tags: ["Admissions Advice", "Legal Truths", "College Counseling"],
    status: "published",
    views: 3120,
    publishedAt: new Date("2026-09-25"),
  },
  {
    title: "Tier-1 vs Tier-2 vs Tier-3 Engineering Colleges: Real Career Trajectories Explained",
    slug: "tier-1-vs-tier-2-vs-tier-3-engineering-colleges-career-trajectories",
    category: "College Comparisons",
    badge: "Career Advice",
    coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    readTime: "5 min read",
    author: {
      name: "Karan Johar Sharma",
      role: "Product Engineering Lead & Career Counselor",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    },
    excerpt: "Does your college tier define your ceiling for the next 10 years? We break down the real differences in Day 1 access, alumni leverage, and off-campus leveling.",
    content: `
### What Does "College Tier" Actually Determine?

The debate over Tier-1 (IITs, BITS, top NITs) vs Tier-2 (top state universities, established private universities) vs Tier-3 colleges is one of the most emotional discussions for students and parents alike.

### The Immediate Advantage: The "Day 1" Pipeline
The biggest advantage of a Tier-1 college is not necessarily superior classroom teaching — it is the **in-person hiring pipeline**. Elite high-frequency trading firms, venture-backed startups, and global R&D teams visit top campuses on Day 1 of placements.

In contrast, at Tier-3 colleges, students often rely on off-campus hiring drives, hackathons, and open-source contributions to get an interview call.

### The 3-Year Equalizer: Proof of Work
In the modern tech and management ecosystems, the college brand fades significantly after your first 2 to 3 years of professional experience. 

- **GitHub & Open Source:** A well-architected open-source contribution or production project outweighs college pedigree.
- **System Design & Problem Solving:** Off-campus referral platforms, competitive programming ratings (Codeforces, LeetCode), and hackathons have democratized recruitment.

### Summary
Your college tier decides where you start your first job; your continuous curiosity, work ethic, and portfolio decide where you reach by age 28.
    `,
    tags: ["College Tier", "Career Growth", "Alumni Advice"],
    status: "published",
    views: 4560,
    publishedAt: new Date("2026-09-26"),
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college-platform";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for Blogs seeding.");

    for (const item of blogsToSeed) {
      await Blog.findOneAndUpdate(
        { slug: item.slug },
        { $set: item },
        { upsert: true, new: true }
      );
      console.log(`Seeded Blog: ${item.title}`);
    }

    console.log("All blogs successfully seeded!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
