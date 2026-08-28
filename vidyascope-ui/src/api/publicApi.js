/**
 * Live Backend Public API Client for VidyaScope User Website
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/public";

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
};
