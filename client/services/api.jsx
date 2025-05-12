import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// ipconfig getifaddr en0
export const API_URL = "http://192.168.31.59:5001/api";

// יצירת אינסטנס של axios עם הגדרות ברירת מחדל
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // חשוב כדי לשמור ולשלוח Cookies
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// פונקציה לניהול שגיאות בצורה אחידה
const handleError = (error, action) => {
  console.error(`❌ Error during ${action}:`, error.response?.data || error.message);
  throw error;
};

// ==================================================================== //
// ======================USER MANAGEMENT=============================== //
// ==================================================================== //
// הרשמת משתמש
export const registerUser = async (userData) => {
  try {
    console.log("📤 Sending Register Request:", userData);
    const response = await axiosInstance.post("/users/register", userData);
    console.log("📥 Server Response:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "registration");
  }
};

// התחברות משתמש ושמירת סשן
export const loginUser = async (credentials) => {
  try {
    console.log("📤 Sending Login Request:", credentials);
    const response = await axiosInstance.post("/users/login", credentials);
    console.log("📥 API Response at Client (Login):", response.data);

    const { user } = response.data;
    if (!user) {
      throw new Error("User data missing in server response.");
    }
    console.log("✅ Login successful. User:", user);
    return user;
  } catch (error) {
    handleError(error, "login");
  }
};

// בדיקת סטטוס המשתמש (האם מחובר)
export const checkAuthStatus = async () => {
  try {
    console.log("🔍 Checking user session...");
    const response = await axiosInstance.get("/users/me");
    console.log("✅ Auth Check Response:", response.data);
    return response.data;
  } catch (error) {
    console.warn("🚫 User not authenticated.");
    return null;
  }
};

// התנתקות
export const logoutUser = async () => {
  try {
    console.log("📤 Sending Logout Request...");
    await axiosInstance.post("/users/logout");
    console.log("🚪 Logged out successfully.");
  } catch (error) {
    handleError(error, "logout");
  }
};

// ==================================================================== //
// ======================SCAN SCREEN AND DEEP SCAN===================== //
// ==================================================================== //

// טריגר לסריקת רשת מהירה
export const triggerScan = async () => {
  try {
    console.log("📡 Initiating scan (via session)");
    const response = await axiosInstance.post("/scan-network"); 
    console.log("📡 Scan response:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "network scan");
  }
};

// טריגר לסריקה עמוקה של הרשת
export const triggerDeepScan = async () => {
  try {
    console.log("📡 Initiating deep scan (via session)");
    const response = await axiosInstance.post("/deep-scan");  
    console.log("📡 Deep Scan response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error during deep network scan:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Schedule a future network scan
 * @param {string} scheduledDateTime ISO string של התאריך והשעה לסריקה
 * @returns {Promise<Object>} הנתונים שהשרת מחזיר
 */
 export const scheduleScan = async (scheduledDateTime) => {
  console.log("📅 scheduleScan: scheduling for", scheduledDateTime);
  try {
    const response = await axiosInstance.post("/scans/schedule", {
      scheduledDateTime,
    });
    console.log("✅ scheduleScan success:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ scheduleScan error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Fetch the currently scheduled scan (if any)
 * @returns {Promise<Object|null>} אובייקט עם scheduledDateTime או null
 */
export const fetchScheduledScan = async () => {
  console.log("🔍 fetchScheduledScan: fetching current schedule");
  try {
    const response = await axiosInstance.get("/scans/schedule");
    console.log("✅ fetchScheduledScan success:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ fetchScheduledScan error:",
      error.response?.data || error.message
    );
    // אם אין שיגור, נחזיר null כדי לא לקרוס בלקוח
    return null;
  }
};

// שליפת היסטוריית סריקות
export const fetchScanHistory = async () => {
  try {
    console.log("🔍 Fetching scan history...");
    const response = await axiosInstance.get("/scans");
    console.log("📜 Scan history received:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "fetching scan history");
  }  
};

// ==================================================================== //
// ==================UPDATE/DELETED/CREATE DEVICES===================== //
// ==================================================================== //

// Delete
export const deleteDevice = async (id) => {
  console.log("🗑 Deleting device", id);
  const res = await axiosInstance.delete(`/devices/${id}`);
  console.log("✅ Deleted:", res.data);
  return res.data;
};

// Update
export const updateDevice = async (id, data) => {
  console.log("✏️ Updating device", id, data);
  const res = await axiosInstance.put(`/devices/${id}`, data);
  console.log("✅ Updated:", res.data);
  return res.data;
};

// Create manual
export const createDevice = async (data) => {
  console.log("➕ Creating device", data);
  const res = await axiosInstance.post(`/devices`, data);
  console.log("✅ Created:", res.data);
  return res.data;
};




// ==================================================================== //
// ======================CVE INTEGRATION=============================== //
// ==================================================================== //
// עבור בדיקת CVE:
export const fetchCVEsForDevice = async (keyword) => {
  try {
    const response = await axios.get(`${API_URL}/cve/${keyword}`);
    console.log("🛡️ CVEs for device:", response.data.length);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch CVEs:", error.message);
    return [];
  }
};

// שמירת פגיעויות בבסיס הנתונים
export const saveSecurityAlerts = async (alerts) => {
  try {
    const response = await axios.post(`${API_URL}/alerts`, alerts, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to save alerts:", error.message);
  }
};


// ==================================================================== //
// ========================ADMIN ONLY!!================================ //
// ==================================================================== //

// שליפת כל המשתמשים (לשימוש אדמין)
export const fetchAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/users");
    console.log("👥 All users fetched:", response.data.length);
    return response.data;
  } catch (error) {
    handleError(error, "fetching all users");
  }
};

// שינוי תפקיד משתמש (user/admin)
export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}/role`, { role: newRole });
    console.log("🔄 Role updated:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "updating user role");
  }
};

// מחיקת משתמש
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    console.log("🗑️ User deleted:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "deleting user");
  }
};

// שליפת סטטיסטיקות לאדמין
export const fetchAdminStats = async () => {
  try {
    const response = await axiosInstance.get("/users/admin/stats");
    console.log("📊 Admin stats:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "fetching admin stats");
  }
};

