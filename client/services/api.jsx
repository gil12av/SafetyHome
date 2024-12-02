import axios from "axios";

// URL בסיסי ל-Backend שלך
const API_URL = "http://localhost:5001/api";

// פונקציה לרישום משתמש חדש
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// פונקציה לשליפת רשימת משתמשים (לדוגמה)
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

