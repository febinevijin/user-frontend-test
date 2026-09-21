import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL, // Set your common base URL  here
  baseURL: process.env.REACT_APP_PUBLIC_BASE_URL, // Set your common base URL  here
  // baseURL: "https://filantrading-backend.onrender.com/api/v1", // Set your common base URL here
});

export default axiosInstance;
