import React, { useState, useEffect } from "react";
import { MessageSquare, Users, Settings, Palette, X } from "lucide-react";

const TutorialCard = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // LocalStorage'dan tutorial gösterildi mi kontrolü
    const tutorialSeen = localStorage.getItem("naber-tutorial-seen");
    if (!tutorialSeen) {
      // İlk girişte veya tutorial gösterilmemişse göster
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("naber-tutorial-seen", "true");
  };

  const handleRemindLater = () => {
    setIsVisible(false);
    // Şimdilik kapatıyoruz ama localStorage'a kaydetmiyoruz
    // Böylece sonraki girişte tekrar gösterilir
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-base-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary to-secondary p-6 rounded-t-2xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost text-white hover:bg-white/20"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Naber Chat'e Hoş Geldiniz!
              </h2>
              <p className="text-white/90 mt-1">
                Modern ve gerçek zamanlı sohbet deneyimi
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Özellik 1 */}
          <div className="flex gap-4 items-start group hover:bg-base-200 p-4 rounded-lg transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2"> Anlık Mesajlaşma</h3>
              <p className="text-base-content/70">
                Socket.IO teknolojisi ile gerçek zamanlı mesajlaşma yapın.
                Mesajlarınız anında karşı tarafa ulaşır!
              </p>
            </div>
          </div>

          {/* Özellik 2 */}
          <div className="flex gap-4 items-start group hover:bg-base-200 p-4 rounded-lg transition-colors">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Çevrimiçi Kullanıcılar</h3>
              <p className="text-base-content/70">
                Hangi arkadaşlarınızın çevrimiçi olduğunu anında görün. Yeşil
                işaret çevrimiçi kullanıcıları gösterir.
              </p>
            </div>
          </div>

          {/* Özellik 3 */}
          <div className="flex gap-4 items-start group hover:bg-base-200 p-4 rounded-lg transition-colors">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Palette className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2"> Tema Özelleştirme</h3>
              <p className="text-base-content/70">
                30+ farklı tema arasından seçim yapın! Ayarlar sayfasından size
                en uygun temayı seçebilirsiniz.
              </p>
            </div>
          </div>

          {/* Özellik 4 */}
          <div className="flex gap-4 items-start group hover:bg-base-200 p-4 rounded-lg transition-colors">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2"> Profil Yönetimi</h3>
              <p className="text-base-content/70">
                Profil fotoğrafınızı yükleyin, bilgilerinizi güncelleyin.
                Cloudinary entegrasyonu ile hızlı resim yükleme!
              </p>
            </div>
          </div>

          {/* Teknoloji Stack */}
          <div className="bg-gradient-to-br from-base-200 to-base-300 p-4 rounded-lg border-2 border-primary/20">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span></span>
              <span>Teknoloji Stack</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>React + Vite</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                <span>Node.js + Express</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span>Socket.IO</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                <span>MongoDB + Mongoose</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-info rounded-full"></span>
                <span>JWT Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-warning rounded-full"></span>
                <span>Tailwind CSS + DaisyUI</span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-info/10 border-l-4 border-info p-4 rounded-r-lg">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span></span>
              <span>Hızlı İpuçları</span>
            </h3>
            <ul className="space-y-2 text-sm text-base-content/70 list-disc list-inside">
              <li>Sol sidebar'dan mesajlaşmak istediğiniz kişiyi seçin</li>
              <li>Sağ üst köşeden ayarlar ve profil sayfalarına erişin</li>
              <li>Tema değişikliği anında uygulanır</li>
              <li>Çıkış yapmak için sağ üstteki Logout butonuna tıklayın</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-base-200 rounded-b-2xl flex flex-col sm:flex-row gap-3 border-t border-base-300">
          <button onClick={handleRemindLater} className="btn btn-ghost flex-1">
            Daha Sonra Hatırlat
          </button>
          <button onClick={handleClose} className="btn btn-primary flex-1">
            Başlayalım!
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialCard;
