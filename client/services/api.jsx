import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// ipconfig getifaddr en0
export const API_URL = "http://192.168.31.131:5001/api";

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

export const getAllUsers = async () => {
  try {
    console.log("📤 trying to fetch users to dropdown.");
    const res = await axiosInstance.get("/users/list"); 
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    return [];
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


// ==================================================================== //
// ========= DASHBOARD (article, feed, comment and like)!!============= //
// ==================================================================== //

// CyberFeed - שליפת כתבות מהשרת
export const fetchArticles = async () => {
  try {
    console.log("🌐 Fetching articles from server...");
    const response = await axiosInstance.get("/articles");
    console.log("✅ Articles received:", response.data.length);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch articles:", error.response?.data || error.message);
    return [];
  }
};

// שליפת פוסטים
export const getAllPosts = async () => {
  try {
    const res = await axiosInstance.get("/posts");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to load posts:", err);
    return [];
  }
};

// שליפת פוסט לפי המזהה הספצפיפי למידה ומישהו לייק ובעת לחיצה נגיע לפוסט .
export const getPostById = async (postId) => {
  try {
    const res = await axiosInstance.get(`/posts/${postId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch post by ID:", err);
    throw err;
  }
};


// יצירת פוסט
export const createPost = async (postData) => {
  try {
    const res = await axiosInstance.post("/posts", postData);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to create post:", err);
    throw err;
  }
};

// מחיקת פוסט
export const deletePost = async (postId) => {
  try {
    const res = await axiosInstance.delete(`/posts/${postId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to delete post:", err);
    throw err;
  }
};

// עדכון פוסט
export const updatePost = async (postId, updatedData) => {
  try {
    const res = await axiosInstance.put(`/posts/${postId}`, updatedData);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to update post:", err);
    throw err;
  }
};

// לייק/ביטול לייק
export const toggleLike = async (postId) => {
  try {
    const res = await axiosInstance.post(`/posts/${postId}/like`);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to like/unlike:", err);
    throw err;
  }
};

// // שליפת תגובות לפוסט
// export const getCommentsForPost = async (postId) => {
//   try {
//     const res = await axiosInstance.get(`/posts/${postId}/comments`);
//     return res.data;
//   } catch (err) {
//     console.error("❌ Failed to fetch comments:", err);
//     return [];
//   }
// };

// יצירת תגובה
export const createComment = async (postId, text) => {
  try {
    const res = await axiosInstance.post(`/posts/${postId}/comments`, { text });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to create comment:", err);
    throw err;
  }
};


// ==================================================================== //
// ================= COMMUNICATE WITH ADMIN AND USERS ================= //
// ==================================================================== //
// שליחת הודעה
export const sendMessage = async ({ recipientId, content, isSystem = false }) => {
  try {
    const res = await axiosInstance.post("/messages", {
      recipientId,
      content,
      isSystem,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to send message:", err);
    throw err;
  }
};

// שליפת כל ההודעות שהמשתמש קיבל
export const getMessages = async () => {
  try {
    const res = await axiosInstance.get("/messages");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch messages:", err);
    return [];
  }
};

// שליפה מלאה של השיחה בין שני משתמשים מסוימים.
export const getConversation = async (otherUserId) => {
  try {
    const res = await axiosInstance.get(`/messages/conversation/${otherUserId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch conversation:", err);
    return [];
  }
};


// סימון הודעה כנקראה
export const markMessageAsRead = async (messageId) => {
  try {
    await axiosInstance.patch(`/messages/${messageId}/read`);
  } catch (err) {
    console.error("❌ Failed to mark message as read:", err);
  }
};

// ==================================================================== //
// ======================== NOTIFICATIONS ============================== //
// ==================================================================== //

// שליפת כל ההתראות של המשתמש
export const getNotifications = async () => {
  try {
    console.log("🔔 Fetching user notifications...");
    const res = await axiosInstance.get("/notifications");
    console.log("📬 Notifications received:", res.data.length);
    return res.data;
  } catch (error) {
    handleError(error, "fetching notifications");
  }
};

// סימון התראה כנקראה
export const markNotificationAsRead = async (notificationId) => {
  try {
    console.log("✅ Marking notification as read:", notificationId);
    await axiosInstance.patch(`/notifications/${notificationId}/read`);
  } catch (error) {
    handleError(error, "marking notification as read");
  }
};


// ==================================================================== //
// ========================== GPT-BOT ================================= //
// ==================================================================== //

// ❓ שולח שאלה ל־GPT ומחזיר תשובה קצרה (2–3 שורות)
export const askGpt = async (prompt) => {
  try {
    console.log("📤 Asking GPT:", prompt);
    const res = await axiosInstance.post("/gpt/ask", { prompt });
    console.log("✅ GPT Answer:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ GPT Error:", err.response?.data || err.message);
    throw err;
  }
};

// 📜 מחזיר את היסטוריית השיחה האחרונה של המשתמש (עד 20 הודעות)
export const getGptHistory = async () => {
  try {
    console.log("📤 Fetching GPT chat history...");
    const res = await axiosInstance.get("/gpt/history");
    console.log("📬 GPT history received:", res.data.length, "messages");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to load GPT history:", err.response?.data || err.message);
    throw err;
  }
};

// function For askGPT and fetchMessage from alertScreen!
export const askCveGpt = async ({ prompt, cveCode }) => {
  try {
    console.log("📤 Asking GPT (CVE):", prompt);
    const res = await axiosInstance.post("/gpt/ask", {
      prompt,
      source: "cve_chat",
      cveCode,
      component: "AlertsScreen",
    });
    return res.data;
  } catch (err) {
    console.error("❌ GPT Error (CVE):", err.response?.data || err.message);
    throw err;
  }
};

export const getCveGptHistory = async () => {
  try {
    const res = await axiosInstance.get("/gpt/history", {
      params: { source: "cve_chat" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to load CVE GPT history:", err.response?.data || err.message);
    return [];
  }
};
