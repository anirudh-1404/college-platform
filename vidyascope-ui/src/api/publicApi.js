/**
 * Live Backend Public API Client for VidyaScope User Website
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL
    ? (import.meta.env.VITE_API_URL.endsWith("/public")
        ? import.meta.env.VITE_API_URL
        : `${import.meta.env.VITE_API_URL}/public`)
    : (import.meta.env.PROD
        ? "https://vidyascope-backend.onrender.com/api/public"
        : "http://localhost:8080/api/public");

export const publicApi = {
  async getColleges(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.stream && params.stream !== "all") queryParams.append("stream", params.stream);
      if (params.query) queryParams.append("query", params.query);
      if (params.location && params.location !== "all") queryParams.append("location", params.location);
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.ownership && params.ownership !== "all") queryParams.append("ownership", params.ownership);

      const url = `${API_BASE_URL}/colleges?${queryParams.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        return data.colleges || [];
      }
      return [];
    } catch (error) {
      console.error("publicApi.getColleges error:", error);
      return [];
    }
  },

  async getCollegeDetail(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/colleges/${id}`);
      const data = await res.json();
      if (data.success) {
        return data.college || null;
      }
      return null;
    } catch (error) {
      console.error("publicApi.getCollegeDetail error:", error);
      return null;
    }
  },

  async getCourses() {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`);
      const data = await res.json();
      if (data.success) {
        return data.courses || [];
      }
      return [];
    } catch (error) {
      console.error("publicApi.getCourses error:", error);
      return [];
    }
  },

  async getCareerGuides(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.category && params.category !== "all") queryParams.append("category", params.category);
      if (params.query) queryParams.append("query", params.query);

      const url = `${API_BASE_URL}/career-guides?${queryParams.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        return data.guides || [];
      }
      return [];
    } catch (error) {
      console.error("publicApi.getCareerGuides error:", error);
      return [];
    }
  },

  async getCareerGuideDetail(slugOrId) {
    try {
      const res = await fetch(`${API_BASE_URL}/career-guides/${slugOrId}`);
      const data = await res.json();
      if (data.success) {
        return data.guide || null;
      }
      return null;
    } catch (error) {
      console.error("publicApi.getCareerGuideDetail error:", error);
      return null;
    }
  },

  async getExams(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.category && params.category !== "all") queryParams.append("category", params.category);
      if (params.query) queryParams.append("query", params.query);

      const url = `${API_BASE_URL}/exams?${queryParams.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        return data.exams || [];
      }
      return [];
    } catch (error) {
      console.error("publicApi.getExams error:", error);
      return [];
    }
  },

  async getExamDetail(slugOrId) {
    try {
      const res = await fetch(`${API_BASE_URL}/exams/${slugOrId}`);
      const data = await res.json();
      if (data.success) {
        return data.exam || null;
      }
      return null;
    } catch (error) {
      console.error("publicApi.getExamDetail error:", error);
      return null;
    }
  },

  async submitInquiry(formData) {
    try {
      const res = await fetch(`${API_BASE_URL}/counseling`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("publicApi.submitInquiry error:", error);
      return { success: false, message: "Network error submitting inquiry." };
    }
  },
};
