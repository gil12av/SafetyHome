const axios = require("axios");

const CVE_API_BASE_URL = "https://www.cve.org/api/cve/search";
const CVE_API_KEY = process.env.CVE_API_KEY;

const fetchCVEsByKeyword = async (keyword) => {
  try {
    const response = await axios.get(`${CVE_API_BASE_URL}?keyword=${keyword}`, {
      headers: {
        Authorization: `APIKey ${CVE_API_KEY}`,
      },
    });

    const vulnerabilities = response.data.vulnerabilities || [];
    return vulnerabilities.map((vuln) => ({
      id: vuln.cve.id,
      severity: vuln.cve.metrics?.cvssV31?.baseSeverity || "Unknown",
      description: vuln.cve.descriptions?.[0]?.value || "No description available",
    }));
  } catch (error) {
    console.error("❌ CVE API error:", error.message);
    return [];
  }
};

module.exports = { fetchCVEsByKeyword };
