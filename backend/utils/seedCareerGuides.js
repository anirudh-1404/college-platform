import "dotenv/config";
import mongoose from "mongoose";
import { CareerGuide } from "../models/CareerGuide.js";

const guidesToSeed = [
  {
    title: "Full Stack Software Engineer",
    slug: "full-stack-software-engineer",
    category: "Engineering & Technology",
    badge: "Engineering & Technology",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    readTime: "6 min roadmap",
    author: "VidyaScope Career Advisory",
    summary: "Build end-to-end scalable web architectures, cloud distributed systems, and modern AI-integrated software applications.",
    shortDescription: "Build end-to-end scalable web architectures, cloud distributed systems, and modern AI-integrated software applications.",
    averageSalary: "₹14 - 32 LPA",
    eligibility: "10+2 with PCM (Class 12) or Bachelor's in Science/Tech",
    requiredDegrees: ["B.Tech Computer Science", "B.Tech IT", "BCA / MCA"],
    targetExams: ["JEE Main", "JEE Advanced", "BITSAT"],
    topRecruiters: ["Google", "Microsoft", "Amazon", "Atlassian", "Uber"],
    roadmapSteps: [
      {
        stepNumber: 1,
        title: "Foundational Degree & Core Computer Science",
        description: "Master Data Structures & Algorithms, Operating Systems, Database Management, and Object-Oriented Architecture.",
        duration: "Years 1 - 2",
      },
      {
        stepNumber: 2,
        title: "Full Stack Web & Cloud Architecture",
        description: "Develop full stack web applications using React, Node.js, PostgreSQL, Docker, and AWS cloud deployment.",
        duration: "Years 3 - 4",
      },
      {
        stepNumber: 3,
        title: "Tier-1 Tech Placements & Scaled Production Systems",
        description: "Clear competitive coding rounds and system design interviews at high-growth global product companies.",
        duration: "Final Year & Beyond",
      },
    ],
    published: true,
  },
  {
    title: "Data Scientist & AI Architect",
    slug: "data-scientist-ai-architect",
    category: "Engineering & Technology",
    badge: "Engineering & Technology",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    readTime: "7 min roadmap",
    author: "VidyaScope Career Advisory",
    summary: "Design cutting-edge machine learning models, neural networks, and big data pipelines for intelligent decision-making.",
    shortDescription: "Design cutting-edge machine learning models, neural networks, and big data pipelines for intelligent decision-making.",
    averageSalary: "₹16 - 36 LPA",
    eligibility: "10+2 with Mathematics / B.Tech or B.Sc in STEM",
    requiredDegrees: ["B.Tech CS / AI & ML", "B.Sc Data Science", "M.Tech / MS in AI"],
    targetExams: ["JEE Main", "GATE CSE / DA", "ISI Entrance"],
    topRecruiters: ["NVIDIA", "Meta", "Microsoft", "Flipkart", "Fractal Analytics"],
    roadmapSteps: [
      {
        stepNumber: 1,
        title: "Mathematical Foundations & Statistical Modeling",
        description: "Build deep proficiency in Linear Algebra, Multivariate Calculus, Probability, and Python data frameworks.",
        duration: "Years 1 - 2",
      },
      {
        stepNumber: 2,
        title: "Machine Learning, Deep Learning & PyTorch",
        description: "Train complex supervised/unsupervised neural models, Transformer architectures, and vector search systems.",
        duration: "Years 3 - 4",
      },
      {
        stepNumber: 3,
        title: "Enterprise MLOPs & Applied AI Engineering",
        description: "Deploy scalable LLM pipelines, fine-tuned models, and real-time inference microservices in production.",
        duration: "Career Launch",
      },
    ],
    published: true,
  },
  {
    title: "Investment Banker & Financial Analyst",
    slug: "investment-banker-financial-analyst",
    category: "Management & Finance",
    badge: "Management & Finance",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    readTime: "8 min roadmap",
    author: "VidyaScope Career Advisory",
    summary: "Advise Fortune 500 corporations on multi-billion dollar mergers, acquisitions, equity capital markets, and financial structuring.",
    shortDescription: "Advise Fortune 500 corporations on multi-billion dollar mergers, acquisitions, equity capital markets, and financial structuring.",
    averageSalary: "₹22 - 45 LPA",
    eligibility: "Bachelor's degree in Finance, Economics, Commerce or STEM",
    requiredDegrees: ["B.Com (Hons)", "BBA Finance", "MBA Finance / PGDM"],
    targetExams: ["CAT", "XAT", "GMAT"],
    topRecruiters: ["Goldman Sachs", "Morgan Stanley", "J.P. Morgan", "McKinsey & Co"],
    roadmapSteps: [
      {
        stepNumber: 1,
        title: "Undergraduate Degree & Financial Accounting",
        description: "Achieve stellar academic record in B.Com/Economics/Engineering and complete financial modeling certifications.",
        duration: "Undergraduate",
      },
      {
        stepNumber: 2,
        title: "Premier MBA (IIMs/XLRI/ISB) & CFA Credentials",
        description: "Crack CAT/GMAT with 99+ percentile, specialize in Corporate Finance, and clear CFA Level 1/2 exams.",
        duration: "MBA (2 Years)",
      },
      {
        stepNumber: 3,
        title: "Front-Office IB Associate & Deal Execution",
        description: "Lead valuation pitch decks, DCF models, LBO analysis, and client roadshows at global investment banks.",
        duration: "Post-MBA",
      },
    ],
    published: true,
  },
];

async function seedCareerGuides() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI not found in env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for career guides seeding...");

    // Remove old mock blog articles
    await CareerGuide.deleteMany({});
    console.log("Cleared old mock guides collection.");

    for (const guide of guidesToSeed) {
      await CareerGuide.create(guide);
      console.log(`Created real Career Guide: ${guide.title}`);
    }

    console.log("Career guidance data seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding career guides:", err);
    process.exit(1);
  }
}

seedCareerGuides();
