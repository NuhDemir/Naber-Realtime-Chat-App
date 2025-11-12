import React, { useEffect } from "react"; // YENİ: useEffect import edildi
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore"; // YENİ: Tema store'u import edildi
import { useKeepAlive } from "./hooks/useKeepAlive"; // YENİ: Keep-alive hook

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const { theme } = useThemeStore(); // YENİ: Mevcut temayı store'dan al

  // YENİ: Keep backend alive (Render free tier için)
  useKeepAlive();

  // YENİ: Tema değiştiğinde <html> etiketini güncellemek için useEffect kullan
  useEffect(() => {
    // document.documentElement, <html> etiketine karşılık gelir
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]); // Bu effect, 'theme' değeri her değiştiğinde yeniden çalışır

  // Auth kontrolü için useEffect
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Auth kontrolü bitene kadar yükleme ekranı göster
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={authUser ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
