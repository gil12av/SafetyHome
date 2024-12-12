import axios from "axios";

const API_URL = "http://localhost:5001/api"; // it may not working on simulator so i take my ip to check if axios request will work.
//const API_URL = "http://192.168.31.190:5001/api"; // swap in case of it not working.

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
    const response = await axios.post(`${API_URL}/scan-network`);
    return response.data;
  } catch (error) {
    console.error("Error during network scan:", error.response?.data || error.message);
    throw error;
  }
};


