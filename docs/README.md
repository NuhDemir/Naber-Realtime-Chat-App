# Naber Realtime Chat App — Teknik & Non-Technical Dokümantasyon

Bu döküman proje hakkındadır. Hem teknik (developer) hem de non-technical (ürün/operasyon) bilgileri içerir. Türkçe hazırlanmıştır.

---

## İçindekiler

1. Proje Özeti
2. Mimari (yükleme akışı, bileşenler)
3. Geliştirme ortamı — yerel (dev)
4. Üretim ortamı — deploy (Netlify, Render)
5. Ortam değişkenleri (env)
6. API uç noktaları (kısa)
7. WebSocket (Socket.IO) akışı
8. Veri modelleri (kısa)
9. Güvenlik ve gizli anahtar yönetimi
10. Yaygın sorunlar ve çözümler (troubleshooting)
11. Katkıda bulunma (contributing)
12. SSS / İletişim

---

## 1) Proje Özeti

Naber Realtime Chat App, React + Vite ile yazılmış bir frontend ve Node/Express + Socket.IO tabanlı gerçek zamanlı bir chat backend içerir. Frontend `frontend/` klasöründe, backend `backend/` klasöründe bulunur. Amaç: gerçek zamanlı mesajlaşma, kullanıcı oturumu, profil güncelleme ve medya (resim) yükleme desteği.

Kısa özellikler:
- Kullanıcı kayıt/giriş/çıkış
- Gerçek zamanlı online kullanıcı listesi (Socket.IO)
- Mesaj gönderme/alma, resim yükleme (Cloudinary)
- Basit CORS/Cookie tabanlı authentication (JWT in HttpOnly cookie)

---

## 2) Mimari

Bileşenler:
- Frontend (Vite + React) — `frontend/`
  - Axios ile backend çağrıları
  - Socket.IO client ile gerçek zamanlı bağlantı
- Backend (Node 18+/22 + Express) — `backend/`
  - REST API (`/api/auth`, `/api/message`)
  - WebSocket (Socket.IO) — gerçek zamanlı eventler
  - MongoDB (Mongoose)
  - Cloudinary (opsiyonel profil resmi upload)

Akış (kısaca):
1. Kullanıcı frontend'den kayıt/giriş yapar.
2. Backend JWT oluşturur ve HttpOnly cookie (`jwt`) olarak gönderecek şekilde ayarlar.
3. Frontend oturum doğrulaması sonrası Socket.IO'ya bağlanır (userId query param ile).
4. Mesaj gönderildiğinde backend veritabanına kaydeder ve hedef kullanıcının socket id'si varsa `newMessage` event'i gönderir.

---

## 3) Geliştirme ortamı — Yerel

Önkoşullar:
- Node.js (LTS), npm
- MongoDB (lokal veya Atlas)

Adımlar:
1. Depoyu klonla.
2. Frontend bağımlılıklarını yükle:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Backend bağımlılıkları:
   ```bash
   cd backend
   npm install
   ```
4. `backend/.env` oluştur (örnek `backend/.env.example` dosyası mevcuttur)
5. Backend çalıştır:
   ```bash
   cd backend
   node server.js
   ```
6. Frontend dev server (vite) ile birlikte çalıştığında, `.env` içindeki `VITE_API_URL` olarak `http://localhost:5000/api` gibi ayarlayın.

Not: Yerel geliştirmede cookie'ler cross-site sorunları yaratabilir; local testler için `NODE_ENV=development` ile çalıştırın.

---

## 4) Üretim ortamı — Deploy

Projede önerilen dağıtım:
- Frontend: Netlify
- Backend: Render (veya başka bir node hosting)

Netlify (frontend) — önerilen ayarlar:
- Base directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variables (Netlify site settings):
  - `VITE_API_URL` = `https://<render-backend-host>/api`
  - `VITE_SOCKET_URL` = `https://<render-backend-host>`

Render (backend) — `render.yaml` kullan or manual:
- Root: `backend`
- Build command: `npm install`
- Start command: `npm run start`
- Environment variables (Render service envs):
  - `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (Netlify site url), `CLOUDINARY_*`, `NODE_ENV=production`

Önemli: Frontend Netlify üzerinde çalışırken backend domain Render olacaktır. Backend `CLIENT_URL` environment değeri olarak Netlify site URL'sini (https://... without trailing slash) almalıdır, aksi halde CORS/socket origin hataları görülebilir.

---

## 5) Ortam Değişkenleri (env)

Backend için (zorunlu/önerilen):
- MONGO_URI (zorunlu) — MongoDB connection string
- JWT_SECRET (zorunlu) — JWT imzalama anahtarı
- CLIENT_URL (zorunlu) — frontend URL (örn. https://naber-chat.netlify.app)
- CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME (isteğe bağlı)
- NODE_ENV — development | production

Frontend için (Vite):
- VITE_API_URL — backend API base (örn `https://<backend>/api`)
- VITE_SOCKET_URL — socket host (örn `https://<backend>`)

Not: Frontend Vite build sırasında import.meta.env ile VITE_ önekli değişkenleri okuyacaktır.

---

## 6) API uç noktaları (kısa)

Auth (prefix: `/api/auth`):
- POST `/signup` — kayıt
- POST `/login` — giriş (cookie olarak jwt set edilir)
- POST `/logout` — çıkış (cookie temizlenir)
- GET `/check` — oturum kontrolü (korumalı)
- PUT `/update-profile` — profil fotoğrafı (korumalı)
- PUT `/update-user-details` — isim/e-posta güncelle (korumalı)

Message (prefix: `/api/message`):
- GET `/users` — sidebar için kullanıcı listesi (korumalı)
- GET `/:id` — belirtilen kullanıcı ile mesajları getir (korumalı)
- POST `/send/:id` — belirtilen kullanıcıya mesaj gönder (korumalı)

Tüm korumalı rotalar `protectRoute` middleware ile JWT kontrolü yapar.

---

## 7) WebSocket (Socket.IO) akışı

- Backend, Socket.IO server'ı `backend/src/lib/socket.js` içinde oluşturur ve CORS origin olarak `CLIENT_URL` kullanır.
- Frontend, `VITE_SOCKET_URL`'e bağlanır ve connect sırasında `query: { userId }` ile kullanıcı kimliğini gönderir.
- Backend bağlantı açıldığında userId ile socket id eşlemesi `userSocketMap` içinde tutulur.
- Mesaj gönderildiğinde (POST /send/:id) backend alıcı için socket id bulursa `io.to(socketId).emit('newMessage', message)` ile gönderir.

---

## 8) Veri Modelleri (kısa)

`User` (örnek):
- fullName, email, password (hashed), profilePic, timestamps

`Message` (örnek):
- senderId, receiverId, text, image, createdAt

---

## 9) Güvenlik & Gizli Anahtar Yönetimi

- `.env` dosyasını kesinlikle repoya commit etmeyin. Repo kökünde `.gitignore` zaten `.env` ve `.env.*` içerir.
- Eğer secrets kazayla commit edildiyse, anahtarları hemen rotasyon yapın (MongoDB kullanıcı şifresi, Cloudinary secret vs.). Gerekirse git geçmiş temizleme yolları (BFG/git filter-repo) kullanın.
- JWT_SECRET güçlü ve rastgele olmalı (en az 32 karakter önerilir).
- Production'da cookie için `sameSite='none'` ve `secure=true` olmalı (cross-site cookie için)

---

## 10) Troubleshooting — Sık Karşılaşılan Sorunlar

1. "Missing parameter name" (path-to-regexp) deploy sırasında:
   - Genelde Express route registration sırasında yanlış değer verilmesinden kaynaklanır. Çözüm:
     - `CLIENT_URL` gibi env değerlerinin route olarak kullanılmadığından emin olun.
     - Circular import'leri kontrol edin (ör. socket <-> controllers döngüsü). Lazımsa dinamik import kullanın.
2. "invalid signature" (JWT verify):
   - `JWT_SECRET` yanlış veya eksik. Render env'inde doğru secret olduğundan emin olun. Tarayıcıdaki eski cookie'leri temizleyin ve yeniden login olun.
3. Socket bağlantı hataları / CORS:
   - Backend `CLIENT_URL` değerini doğru (https ve son / olmadan) girin.
   - Cookie gönderim sorunları için cookie opsiyonlarını kontrol edin (sameSite/secure).

---

## 11) Katkıda Bulunma (Contributing)

- Fork & Pull Request workflow önerilir.
- Kod standartı: ESLint ve basit kod formatı (frontend/ ve backend/ ayrı lint kuralları). Pull request içerisinde test ve kısa açıklama ekleyin.

---

## 12) SSS / İletişim

- Deploy ile ilgili sorunlarda Render/Netlify log'larını paylaşın. Logların ilgili kısmı (hata stack trace) genellikle sorunun yerini gösterir.
- Gizli anahtarlarla ilgili sorunlarda, önce anahtarları rotasyon yapın.

---

## Ekler
- `backend/.env.example` dosyası repo içinde bulunur. Buna göre kendi `backend/.env` dosyanızı oluşturun.

---

Hazır döküman: bu dosyada eksik olduğunu düşündüğünüz kısımları belirtirseniz ekleyip genişletebilirim (ör. daha detaylı API açıklamaları, ER diyagramı, deployment YAML örnekleri, CI/CD pipeline örneği vb.).
