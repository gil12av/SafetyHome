import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = "http://192.168.31.107:5001/api";

// הרשמת משתמש
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// התחברות משתמש ושמירת טוקן
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    console.log("📥 API Response at Client (Login):", response.data);
    
    const { user, token } = response.data;  // שליפת המשתמש והטוקן
    console.log("🔑 Extracted Token at Client:", token);

    return { ...user, token };  // החזרת הטוקן יחד עם פרטי המשתמש
  } catch (error) {
    console.error("❌ Error logging in:", error.response?.data || error.message);
    throw error;
  }
};



// טריגר לסריקת רשת
export const triggerScan = async (userId) => {
  try {
    const storedUser = await AsyncStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    if (!token) {
      throw new Error("No token found. Please login again.");
    }

    const response = await axios.post(`${API_URL}/scan-network`, 
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("📡 Scan response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during scan request:", error.response?.data || error.message);
    throw error;
  }
};

// שליפת היסטוריית סריקות
export const fetchScanHistory = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('user');
    console.log("🔍 Retrieved user from AsyncStorage (Scan History):", storedUser);

    const token = storedUser ? JSON.parse(storedUser).token : null;
    console.log("🔑 Token extracted for Scan History:", token);

    if (!token) {
      throw new Error("No token found. Please login again.");
    }

    const response = await axios.get(`${API_URL}/scans`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("📜 Scan history received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch scan history:", error.response?.data || error.message);
    throw error;
  }
};
