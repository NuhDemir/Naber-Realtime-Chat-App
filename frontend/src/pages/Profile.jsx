// src/pages/Profile.jsx

import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Pencil, Save, X, Lock } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile, updateUserDetails } =
    useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  // Bileşen yüklendiğinde veya authUser değiştiğinde formu doldur
  useEffect(() => {
    if (authUser) {
      setFormData({
        // Ensure we never set undefined into the inputs — always provide empty string fallback
        fullName: authUser.fullName || "",
        email: authUser.email || "",
      });
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Fotoğraf boyutu 5MB'dan küçük olmalıdır");
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith("image/")) {
      return toast.error("Lütfen geçerli bir resim dosyası seçin");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image });
        toast.success("Profil fotoğrafı güncellendi!");
      } catch (error) {
        console.error("Profil fotoğrafı yükleme hatası:", error);
        toast.error(error.message || "Fotoğraf yüklenirken bir hata oluştu");
      }
    };
    reader.onerror = () => {
      toast.error("Dosya okuma hatası");
    };
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      return toast.error("İsim ve e-posta boş bırakılamaz.");
    }
    // Backend'e güncelleme isteği gönder
    await updateUserDetails(formData);
    setIsEditing(false); // Düzenleme modundan çık
  };

  return (
    <div className="min-h-screen pt-20 bg-base-200">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-base-100 rounded-xl p-6 shadow-md border border-base-300">
          {/* Başlık */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold">Profil Bilgileri</h1>
            <p className="text-sm text-gray-500 mt-1">
              Kişisel bilgilerinizi yönetin
            </p>
          </div>

          {/* Avatar Yükleme */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className={`size-32 rounded-full object-cover border-4 border-base-300 ${
                  isUpdatingProfile ? "opacity-70" : ""
                }`}
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-primary hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-base-100" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-500">
              {isUpdatingProfile
                ? "Yükleniyor..."
                : "Fotoğrafı değiştirmek için kameraya tıkla"}
            </p>
          </div>

          {/* Kullanıcı Bilgileri Formu */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Kişisel Bilgiler</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-ghost btn-sm"
                >
                  <Pencil size={16} /> Düzenle
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateDetails}
                    className="btn btn-success btn-sm"
                  >
                    <Save size={16} /> Kaydet
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost btn-sm"
                  >
                    <X size={16} /> İptal
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              // DÜZENLEME MODU
              <form onSubmit={handleUpdateDetails} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <User size={14} /> Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Mail size={14} /> Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </form>
            ) : (
              // GÖRÜNTÜLEME MODU
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-zinc-400 flex items-center gap-2">
                      <User size={14} /> Full Name
                    </span>
                  </label>
                  <p className="px-1 text-base">{authUser?.fullName}</p>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-zinc-400 flex items-center gap-2">
                      <Mail size={14} /> Email Address
                    </span>
                  </label>
                  <p className="px-1 text-base">{authUser?.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Hesap Bilgileri */}
          <div className="mt-6 bg-base-200/50 rounded-xl p-4">
            <h2 className="text-lg font-medium mb-2">Hesap Bilgileri</h2>
            <div className="flex items-center justify-between py-2 border-b border-base-300">
              <span className="text-sm">Üyelik Tarihi</span>
              <span className="text-sm font-mono">
                {authUser?.createdAt
                  ? new Date(authUser.createdAt).toLocaleDateString()
                  : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Hesap Durumu</span>
              <span className="badge badge-success badge-sm text-white">
                Aktif
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
