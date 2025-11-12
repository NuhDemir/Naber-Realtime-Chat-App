import { useEffect, useRef } from "react";
import { axiosInstance } from "../lib/axios";

/**
 * Custom hook to keep the Render backend alive by sending periodic ping requests
 * Prevents the free tier Render service from spinning down after 15 minutes of inactivity
 */
export const useKeepAlive = () => {
  const intervalRef = useRef(null);

  useEffect(() => {
    // Function to ping the backend
    const pingBackend = async () => {
      try {
        await axiosInstance.get("/auth/ping");
        console.log(
          "[KeepAlive] Backend pinged successfully at",
          new Date().toLocaleTimeString()
        );
      } catch (error) {
        console.warn("[KeepAlive] Ping failed:", error.message);
      }
    };

    // Initial ping
    pingBackend();

    // Set up interval to ping every 10 minutes (600000ms)
    // This keeps the backend active before Render's 15-minute timeout
    intervalRef.current = setInterval(pingBackend, 10 * 60 * 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log("[KeepAlive] Cleanup: interval cleared");
      }
    };
  }, []);

  return null;
};
