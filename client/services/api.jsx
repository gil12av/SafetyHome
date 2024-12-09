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
    const response = await fetch('http://localhost:5001/api/scan-network');
    if (!response.ok) throw new Error('Failed to scan network');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};


