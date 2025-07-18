import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL'i doğrudan ortam değişkeninden alıyoruz
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,
});

// Bu fonksiyonu burada bırakabilirsiniz, bir zararı yok.
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}