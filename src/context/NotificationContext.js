import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  const [unseenCount, setUnseenCount] = useState(0);

  const fetchUnseenCount = async () => {
    if (!userInfo?.token) return;
    try {
      const response = await axiosInstance.get(`/notification/user/unseen-notif`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (response.data.success) {
        setUnseenCount(response.data.data.unseenCount);
      }
    } catch (error) {
      console.error("Failed to fetch unseen count:", error.message);
    }
  };

  return (
    <NotificationContext.Provider value={{ unseenCount, setUnseenCount, fetchUnseenCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
