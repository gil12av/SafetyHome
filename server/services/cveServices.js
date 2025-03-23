const axios = require("axios");

// כתובת ה-API הנכונה של NVD
const NVD_API_BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";

// משיכת מפתח מהסביבה
const NVD_API_KEY = process.env.CVE_API_KEY;

const fetchCVEsByKeyword = async (keyword) => {
  try {
    const response = await axios.get(`${NVD_API_BASE_URL}?keywordSearch=${keyword}`, {
      headers: {
        "apiKey": NVD_API_KEY,
      },
    });

    console.log("✅ NVD Raw Response:", JSON.stringify(response.data, null, 2));

    const cveItems = response.data.vulnerabilities || [];

    return cveItems.map((item) => ({
      id: item.cve.id,
      severity: item.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || "Unknown",
      description: item.cve.descriptions?.[0]?.value || "No description provided.",
    }));
  } catch (error) {
    console.error("❌ NVD API Error:", error.message);
    return [];
  }
};

module.exports = { fetchCVEsByKeyword };
