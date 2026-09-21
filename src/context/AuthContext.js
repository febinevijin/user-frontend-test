import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_KEYS } from "../utils/Utils";

// Create AuthContext
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [THEME, setTHEME] = useState("dark"); // default theme
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if adminInfo is already in localStorage on initial load
  useEffect(() => {
    const storedUserInfo = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
    if (storedTheme) {
      setTHEME(storedTheme);
    }

    setLoading(false);
  }, []);

  // Login function
  const login = (data) => {
   localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(data));
    setUserInfo(data);
    navigate("/overview");
  };

  // Logout function
  const logout = () => {
    // localStorage.removeItem("filanUserInfo");
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    setUserInfo(null);
    // localStorage.removeItem("userTheme"); // Remove theme preference on logout
    localStorage.removeItem(LOCAL_STORAGE_KEYS.THEME); // Remove theme preference on logout
    navigate("/auth-login");
  };

  // Toggle theme and store in localStorage
  const toggleTheme = () => {
    const newTheme = THEME === "dark" ? "light" : "dark";
    setTHEME(newTheme);
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
  };

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, login, logout, THEME, toggleTheme, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};



