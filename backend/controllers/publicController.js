import { College } from "../models/College.js";

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
    if (!college) {
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
      examAccepted: college.admissions?.examAccepted || ["National Entrance"],
      placementPercent: college.placements?.placementRate || 95,
      facilities: college.facilities || [],
      coursesOffered: college.coursesOffered || [],
      admissions: college.admissions,
      admissionCutoffs: college.admissionCutoffs || [],
      placements: college.placements,
      rankings: college.rankings,
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
