import axios from "axios";

const API_URL = "http://localhost:5001/api";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const scanNetwork = async () => {
  try {
    const response = await axios.get(`${API_URL}/scan-network`);
    return response.data;
  } catch (error) {
    console.error("Error scanning network:", error);
    throw error;
  }
};
