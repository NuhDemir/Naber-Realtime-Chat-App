
# Naber - Gerçek Zamanlı Sohbet Uygulaması

**Naber**, modern web teknolojileri ile geliştirilmiş, gerçek zamanlı iletişim sağlayan, tam donanımlı bir sohbet uygulamasıdır. Kullanıcı dostu arayüzü, tema seçenekleri ve güvenli yapısıyla WhatsApp gibi uygulamalara benzer bir deneyim sunar.

---

## ✨ Temel Özellikler

- 🔌 **Gerçek Zamanlı Sohbet** – Socket.IO ile anlık mesajlaşma
- 🔐 **Kullanıcı Kimlik Doğrulama** – JWT ve cookie tabanlı güvenli oturum yönetimi
- 🟢 **Online Durum Takibi** – Kullanıcıların çevrimiçi/çevrimdışı durumlarını anlık olarak görüntüleme
- 🎨 **Dinamik Tema Sistemi** – DaisyUI ile entegre 30+ tema seçeneği
- 👤 **Profil Yönetimi** – Profil fotoğrafı, isim ve e-posta güncellenebilir
- 💻 **Modern ve Duyarlı Arayüz** – React ve Tailwind CSS ile mobil/masaüstü uyumluluk
- 🎞️ **Akıcı Animasyonlar** – Framer Motion ile zenginleştirilmiş kullanıcı deneyimi
- 🛠️ **RESTful API** – Express.js ve MongoDB ile oluşturulmuş modüler backend

---

## 🚀 Kullanılan Teknolojiler

### Frontend
| Teknoloji | Açıklama |
|----------|----------|
| React | UI Framework |
| React Router DOM | Sayfa yönlendirme |
| Zustand | Global state yönetimi |
| Tailwind CSS + DaisyUI | UI tasarımı ve temalar |
| Framer Motion | Arayüz animasyonları |
| Axios | HTTP istekleri |
| Lucide React | İkonlar |
| Socket.IO Client | Gerçek zamanlı iletişim |

### Backend
| Teknoloji | Açıklama |
|----------|----------|
| Node.js + Express.js | Sunucu ve API |
| MongoDB + Mongoose | Veritabanı ve ODM |
| JWT & bcrypt.js | Kimlik doğrulama |
| Socket.IO | Gerçek zamanlı sunucu |
| Cloudinary | Profil resmi yönetimi |
| Diğer | `cookie-parser`, `cors`, `dotenv` |

---

## 🛠️ Kurulum ve Çalıştırma

### 🔧 Ön Gereksinimler

- Node.js (v18 veya üzeri)
- MongoDB veya MongoDB Atlas hesabı

### 📥 1. Projeyi Klonlayın

```bash
git clone https://github.com/[KULLANICI_ADINIZ]/naber-chat-app.git
cd naber-chat-app
```

### 🖥️ 2. Backend Kurulumu

```bash
cd backend
npm install
touch .env
```

`.env` dosyasına aşağıdaki değişkenleri girin:

```env
PORT=5001
MONGO_URI=mongodb+srv://<kullanıcı>:<şifre>@cluster.mongodb.net/naber
JWT_SECRET=GIZLI_ANAHTARINIZ
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 💻 3. Frontend Kurulumu

```bash
cd ../frontend
npm install
```

### ▶️ 4. Uygulamayı Başlatma

**Terminal 1 – Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend:**

```bash
cd frontend
npm run dev
```

> Uygulama şimdi [http://localhost:5173](http://localhost:5173) adresinde çalışıyor olmalıdır.

---

## 📂 Proje Yapısı

```plaintext
naber-chat-app/
├── backend/
│   ├── src/
│   │   ├── controller/      # API mantığı (signup, login, sendMessage...)
│   │   ├── lib/             # Veritabanı ve socket bağlantıları
│   │   ├── middleware/      # protectRoute gibi ara yazılımlar
│   │   ├── models/          # Mongoose şemaları (User, Message)
│   │   └── routes/          # API rotaları (auth, message)
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/      # Reusable bileşenler (Navbar, Sidebar...)
│   │   ├── pages/           # Sayfa bileşenleri (Home, Login, Settings...)
│   │   ├── store/           # Zustand store'lar (authStore, chatStore...)
│   │   ├── lib/             # Yardımcı fonksiyonlar ve axios instance
│   │   ├── App.jsx
│   │   └── index.jsx
└── README.md
```

---

## 🤝 Katkıda Bulunma

Katkılar projeyi daha güçlü kılar! Bir "pull request" açmadan önce lütfen ilgili konuda bir "issue" oluşturun.

Adımlar:

1. Projeyi **fork** edin.
2. Yeni bir dal oluşturun:  
   `git checkout -b feature/YeniOzellik`
3. Değişikliklerinizi yapın ve commitleyin:  
   `git commit -m 'Yeni bir özellik eklendi'`
4. Dalınızı push edin:  
   `git push origin feature/YeniOzellik`
5. Bir **Pull Request** açın.

---

## 📄 Lisans

Bu proje [MIT Lisansı](https://opensource.org/licenses/MIT) ile lisanslanmıştır.

---

> 💬 Naber, modern yazılım mimarileriyle geliştirilen kullanıcı odaklı bir sohbet platformudur. Her katkı, daha güvenli, daha hızlı ve daha keyifli bir deneyim sunmamıza destek olur.
