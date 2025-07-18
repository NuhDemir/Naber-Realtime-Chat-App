import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Socket.IO için de ortam değişkenini kullanıyoruz.
// Vite, .env dosyasındaki değişkenlere import.meta.env üzerinden erişir.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const useAuthStore = create((set, get) => ({
  // ==================
  //      STATE
  // ==================
  authUser: null,           // Giriş yapmış kullanıcı bilgileri veya null
  isSigningUp: false,       // Kayıt olma işlemi devam ediyor mu?
  isLoggingIn: false,       // Giriş yapma işlemi devam ediyor mu?
  isUpdatingProfile: false, // Profil güncelleme işlemi devam ediyor mu?
  isCheckingAuth: true,     // Uygulama başlangıcındaki oturum kontrolü devam ediyor mu?
  onlineUsers: [],          // Çevrimiçi kullanıcıların ID listesi
  socket: null,             // Socket.IO bağlantı nesnesi

  // ==================
  //     ACTIONS
  // ==================

  // Kullanıcı oturumunu kontrol eden fonksiyon
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket(); // Oturum varsa socket'e bağlan
    } catch (error) {
      console.log("Error in checkAuth:", error.message);
      set({ authUser: null }); // Hata (genellikle 401) varsa oturum yok demektir
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Kayıt olma fonksiyonu
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Hesap başarıyla oluşturuldu");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Kayıt başarısız oldu");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Giriş yapma fonksiyonu
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Giriş başarılı");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Giriş başarısız oldu");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Çıkış yapma fonksiyonu
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket(); // Önce socket bağlantısını kes
      set({ authUser: null, socket: null, onlineUsers: [] }); // Sonra tüm ilgili state'leri temizle
      toast.success("Çıkış yapıldı");
    } catch (error) {
      toast.error(error.response?.data?.message || "Çıkış başarısız oldu");
    }
  },

  // Profil fotoğrafını güncelleme fonksiyonu
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profil fotoğrafı güncellendi");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Profil fotoğrafı güncellenemedi");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Kullanıcı bilgilerini (isim, e-posta) güncelleme fonksiyonu
  updateUserDetails: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-user-details", data);
      set({ authUser: res.data });
      toast.success("Profil bilgileri güncellendi!");
    } catch (error) {
      console.error("Error in updateUserDetails:", error);
      toast.error(error.response?.data?.message || "Bilgiler güncellenemedi.");
    }
  },

  // Socket.IO'ya bağlanma fonksiyonu
  connectSocket: () => {
    const { authUser, socket } = get();
    // Sadece kullanıcı giriş yapmışsa ve zaten bir bağlantı yoksa bağlan
    if (authUser && !socket?.connected) {
      const newSocket = io(SOCKET_URL, {
        query: {
          userId: authUser._id,
        },
      });

      newSocket.on("connect", () => {
        set({ socket: newSocket });
      });

      newSocket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    }
  },

  // Socket.IO bağlantısını kesme fonksiyonu
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));