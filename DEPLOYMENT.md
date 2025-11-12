# Naber Chat App — Deployment Checklist (Render + Netlify)

Bu dosya Render (backend) ve Netlify (frontend) üzerinde deploy için gerekli adım adım kontrol listesidir.

---

## Backend (Render) — Deployment Checklist

### 1) Render Service Oluştur

- Render dashboard → New → Web Service
- GitHub repo'yu bağla: `NuhDemir/Naber-Realtime-Chat-App`
- Branch: `main`
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm run start`
- (Alternatif: "Create from render.yaml" seçeneği kullanılabilir — repo kökünde `render.yaml` mevcut)

### 2) Environment Variables Ekle (Render → Service → Environment)

Aşağıdaki environment değişkenlerini Render dashboard'da ekle:

**Zorunlu:**

- `NODE_ENV` = `production`
- `PORT` = `5000` (veya boş bırak, Render otomatik atar)
- `MONGO_URI` = `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority`
- `JWT_SECRET` = `<güçlü-rastgele-string-en-az-32-karakter>`
- `CLIENT_URL` = `https://naber-chat.netlify.app` (Netlify site URL — sonunda `/` OLMADAN)

**Opsiyonel (profil resmi yükleme için):**

- `CLOUDINARY_CLOUD_NAME` = `<cloudinary-cloud-name>`
- `CLOUDINARY_API_KEY` = `<cloudinary-api-key>`
- `CLOUDINARY_API_SECRET` = `<cloudinary-api-secret>`

**Önemli Notlar:**

- `CLIENT_URL` değeri kesinlikle Netlify üzerinde deploy edilen frontend URL'i olmalı (örn. `https://naber-chat.netlify.app` — sonunda `/` olmadan).
- `JWT_SECRET` değerini önceki deploy'da kullanılan aynı değer ile ayarlayın; yoksa kullanıcılar yeniden login olmak zorunda kalacaktır.
- `MONGO_URI` içinde kullanıcı şifresi ve database adı doğru olmalı.

### 3) Deploy Başlat

- Environment değişkenlerini kaydettikten sonra "Manual Deploy" veya otomatik tetikleme ile deploy başlatın.
- Deploy log'larını izleyin:
  - `[app] Starting dynamic route imports...`
  - `[mod] ... loaded` logları
  - Hata varsa: `[app] Route registration failed` veya `path-to-regexp` hatası arayın.

### 4) Deploy Sonrası Kontroller

- Render üzerinde Service URL elde edin (örn. `https://naber-backend.onrender.com`).
- Tarayıcıdan `https://<render-url>/api/auth/check` isteği gönderin → 401 Unauthorized beklenir (token yok).
- Render log'larında "Server is running on PORT: ..." mesajını kontrol edin.

---

## Frontend (Netlify) — Deployment Checklist

### 1) Netlify Site Oluştur

- Netlify dashboard → New site from Git
- GitHub repo'yu bağla: `NuhDemir/Naber-Realtime-Chat-App`
- Branch: `main`

### 2) Build Settings (Netlify UI)

- **Base directory:** `frontend`
- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`

(Alternatif: repo kökünde `netlify.toml` var — Netlify bunu otomatik okur; ancak UI'de manuel girmeyi tercih edebilirsiniz.)

### 3) Environment Variables Ekle (Netlify → Site settings → Build & deploy → Environment)

Aşağıdaki değişkenleri ekleyin:

**Zorunlu:**

- `VITE_API_URL` = `https://<render-backend-url>/api` (örn. `https://naber-backend.onrender.com/api`)
- `VITE_SOCKET_URL` = `https://<render-backend-url>` (örn. `https://naber-backend.onrender.com`)
- `NODE_ENV` = `production` (opsiyonel ama önerilir)

**Önemli Notlar:**

- `VITE_API_URL` sonunda `/api` olmalı (Vite build sırasında bu değer frontend koduna gömülecektir).
- `VITE_SOCKET_URL` backend'in root URL'i (socket.io bağlantısı için).

### 4) Deploy Başlat

- Değişiklikleri kaydedip deploy başlatın (veya GitHub push tetiklemesi).
- Build log'larını izleyin — `vite build` başarılı olmalı.

### 5) Deploy Sonrası Kontroller

- Netlify site URL'ini kopyalayın (örn. `https://naber-chat.netlify.app`).
- Bu URL'i Render'daki `CLIENT_URL` env değerine ekleyin (eğer henüz eklememişseniz).
- Tarayıcıdan Netlify site açın → Login/Signup sayfası görünmeli.

---

## Son Kontroller ve Test

### 1) CORS & Cookie Testi

- Netlify frontend açık → Login/Signup yapın.
- Browser DevTools → Network → `/api/auth/login` veya `/signup` isteğini kontrol edin:
  - Response Headers → `Set-Cookie: jwt=...; SameSite=None; Secure; HttpOnly` olmalı.
  - Eğer cookie set edilmiyorsa veya `SameSite=Strict` görüyorsanız, backend kodundaki cookie ayarlarını kontrol edin (`backend/src/lib/utils.js`).

### 2) Socket.IO Bağlantısı

- Login olduktan sonra Developer Console → Network → WS (WebSocket) tab → `socket.io` bağlantısını kontrol edin.
- Bağlantı başarılıysa `101 Switching Protocols` görülmeli.
- Eğer bağlantı hatası alıyorsanız (`403`, `CORS error`), backend `CLIENT_URL` env değişkenini kontrol edin.

### 3) Mesaj Gönderme

- İki farklı kullanıcıyla login olup (iki tarayıcı veya incognito mod) mesaj gönderme testi yapın.
- Mesaj anında diğer tarafta görünüyorsa Socket.IO başarılı çalışıyordur.

### 4) Profil Resmi Yükleme (opsiyonel)

- Eğer Cloudinary env'leri eklediyseniz, Settings → Update Profile Picture ile resim yükleyip kontrol edin.

---

## Troubleshooting — Sık Görülen Hatalar

### 1) "invalid signature" (JWT)

- **Sebep:** Backend `JWT_SECRET` yanlış veya eksik.
- **Çözüm:** Render env'inde `JWT_SECRET` ekleyin veya düzeltin. Tarayıcıdaki eski cookie'leri temizleyin (DevTools → Application → Cookies → Delete) ve yeniden login olun.

### 2) "CORS error" veya "403 Forbidden" (Socket.IO)

- **Sebep:** Backend `CLIENT_URL` yanlış veya eksik.
- **Çözüm:** Render env'inde `CLIENT_URL = https://<netlify-site-url>` (sonunda `/` olmadan) ekleyin ve redeploy edin.

### 3) Cookie gönderilmiyor (cross-site)

- **Sebep:** Cookie `SameSite=Strict` veya `Secure=false`.
- **Çözüm:** Backend kodunda (`backend/src/lib/utils.js`) cookie options:
  ```js
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  secure: process.env.NODE_ENV === 'production'
  ```
  Bu değişiklik zaten yapılmıştır; eğer sorun devam ediyorsa `NODE_ENV=production` olup olmadığını kontrol edin.

### 4) "Missing parameter name" (path-to-regexp) deploy sırasında

- **Sebep:** Express route registration sırasında yanlış string veya circular import.
- **Çözüm:** En son commit'te circular import düzeltildi (`message.controller.js` içinde socket lazy import). Eğer hala görüyorsanız deploy log'larını paylaşın.

---

## Güvenlik Notları

1. **Secrets Rotasyonu:**

   - Eğer `.env` dosyası git geçmişine commit edildiyse (yanlışlıkla), hemen tüm anahtarları rotasyon yapın:
     - MongoDB kullanıcı şifresi
     - JWT_SECRET
     - Cloudinary API secret
   - Git geçmişi temizliği için BFG Repo-Cleaner veya git filter-repo kullanılabilir.

2. **HTTPS Zorunlu:**

   - Production'da mutlaka HTTPS kullanın (Netlify ve Render otomatik HTTPS sağlar).
   - Cookie `Secure=true` ayarı HTTPS gerektirir.

3. **Rate Limiting:**
   - Opsiyonel: Backend'e `express-rate-limit` ekleyip API isteklerini sınırlayabilirsiniz (DDoS koruması).

---

## Deploy Sonrası — İzleme

- **Render Logs:** Service → Logs bölümünden runtime log'larını izleyebilirsiniz.
- **Netlify Deploy Logs:** Deploys → Click on deploy → Log bölümünden build log'larını görebilirsiniz.
- **MongoDB Atlas:** Eğer Atlas kullanıyorsanız, Metrics bölümünden bağlantı sayısı ve query performansını izleyin.

---

## İletişim / Destek

Eğer deploy sırasında sorun yaşarsanız:

1. Render/Netlify deploy log'larının ilgili kısmını (hata stack trace) kopyalayın.
2. Environment değişkenlerinin doğru olup olmadığını (özellikle `CLIENT_URL`, `VITE_API_URL`, `JWT_SECRET`) kontrol edin.
3. Bu checklist'teki adımları sırayla takip edin.

---

**Son Güncelleme:** 2025-11-09  
**Repo:** https://github.com/NuhDemir/Naber-Realtime-Chat-App
