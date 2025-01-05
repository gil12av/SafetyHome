import axios from "axios";

//const API_URL = "http://localhost:5001/api"; // it may not working on simulator so i take my ip to check if axios request will work.
const API_URL = "http://192.168.31.107:5001/api"; // swap in case of it not working.

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    
    console.log("📥 API Response at Client:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("❌ Error logging in:", error.response?.data || error.message);
    throw error;
  }
};


// i want to pass the userId.
export const scanNetwork = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/scan-network`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error during network scan:", error.response?.data || error.message);
    throw error;
  }
};


