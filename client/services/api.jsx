import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = "http://192.168.31.68:5001/api";

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


