# 🥕 Umapyoi Portal

> 🌐 **Live:** https://umapyoi-portal-frontend.onrender.com/

Trang web tiếng Anh dành cho game **Umamusume: Pretty Derby** — tra cứu nhân vật (thân thê / ウマ娘), thẻ hỗ trợ (support cards), kỹ năng (skills) và meta Champions Meeting.

Dữ liệu được lấy từ **GameTora** (CDN + scraping) kết hợp với dữ liệu local.

## ✨ Tính năng

- 🏇 **Characters** — Danh sách nhân vật, chi tiết từng biến thể:
  - Chỉ số cộng (Stat bonuses), aptitude theo sân cỏ / khoảng cách / chiến thuật
  - Kỹ năng Unique / Innate / Awakening / từ sự kiện
  - **Training Events** — hiển thị lựa chọn + hiệu ứng, tooltip chi tiết kỹ năng & trạng thái
  - Objectives (mục tiêu đua), profile, thông tin thân thê
- 🃏 **Support Cards** — Tra cứu thẻ hỗ trợ SSR/SR/R
- ⚡ **Skills** — Bộ lọc kỹ năng theo 17 nhóm hiệu ứng + Unique, tooltip mô tả chi tiết
- 🏆 **Champions Meeting** — Meta guide cho từng mùa giải (CM14, CM15) với tier list, skill khuyến nghị
- 🌗 **Dark / Light mode**

## 🧱 Kiến trúc

```
Umapyoi-Portal/
├── backend/                # Express API
│   ├── routes/
│   │   ├── characterRoutes.js      # /api/characters (+ proxy GameTora data)
│   │   ├── skillRoutes.js          # /api/skills
│   │   ├── supportCardRoutes.js    # /api/support-cards
│   │   ├── umaCharacterRoutes.js   # /api/uma-characters
│   │   └── iconUploadRoutes.js     # /api/icons (upload strategy icons)
│   ├── models/             # Mongoose models (Character, Skill, SupportCard)
│   ├── gametoraSkills.js   # Fetch + map dữ liệu kỹ năng từ GameTora CDN
│   ├── uma_data.js         # Dữ liệu kỹ năng / thân thê local
│   └── server.js           # Entry point (serve cả frontend dist)
│
└── frontend/               # React + Vite + Tailwind
    └── src/
        ├── pages/          # Home, Characters, Skills, Support Cards, Champions Meeting, ...
        └── data/           # Static meta guide (cm14.js, cm15.js)
```

**Luồng dữ liệu GameTora:**

```
GameTora CDN (skills.{hash}.json)     GameTora Website (scrape __NEXT_DATA__)
        │                                        │
        ▼                                        ▼
fetchGtSkillsMap()                     fetchGametoraData()  (mỗi nhân vật)
        │                                        │
        └────────────────┬───────────────────────┘
                         ▼
             Merge layer (GT + local data)
                         ▼
         /api/skills  |  /api/characters/:name/gametora-data
```

## 🚀 Chạy local

### Yêu cầu

- [Node.js](https://nodejs.org/) 18+ (dùng `fetch` built-in)
- [MongoDB](https://www.mongodb.com/) chạy local (mặc định `mongodb://127.0.0.1:27017/umapyoi`)

### 1. Cài dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Cấu hình môi trường (tuỳ chọn)

Backend dùng MongoDB local mặc định. Nếu muốn thay đổi, tạo file `backend/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/umapyoi
PORT=5000
```

Frontend mặc định gọi API tại `http://localhost:5000`. Nếu đổi port, tạo `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

> Lưu ý: Character list, support cards được lấy từ MongoDB — cần seed database (import dữ liệu vào collection `characters`, `supportcards`).

### 3. Khởi động

```bash
# Backend (port 5000)
cd backend
npm run dev

# Frontend (port 5173)
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000 (kèm `/api/health`)

## 🔌 API chính

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/characters` | Danh sách nhân vật |
| GET | `/api/characters/:name` | Chi tiết nhân vật + biến thể |
| GET | `/api/characters/:name/gametora-data?cardId=` | Dữ liệu GameTora (skill, events, objectives) |
| GET | `/api/skills` | Danh sách kỹ năng (filter `?category=`, `?q=`) |
| GET | `/api/skills/categories` | Danh sách nhóm kỹ năng |
| GET | `/api/support-cards` | Danh sách thẻ hỗ trợ |
| GET | `/api/uma-characters` | Dữ liệu aptitude thân thê |
| POST | `/api/icons/upload` | Upload icon chiến thuật (xem `backend/ICON_UPLOAD_README.md`) |
| GET | `/api/health` | Health check |

## 📦 Production build

```bash
cd backend
npm run build   # tự cài + build frontend
```

Sau đó chạy `node server.js` — Express sẽ serve cả frontend `dist/`.

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router 7, Vite 8, Tailwind CSS 4
- **Backend:** Node.js, Express 5, Mongoose 9, Multer
- **Database:** MongoDB
- **Data source:** GameTora CDN + web scraping

## ⚠️ Ghi chú

- Kỹ năng & sự kiện từ GameTora được cache trong bộ nhớ (skill 24h, character data 1h) để giảm tải scraping.
- Một số nhân vật mới chưa có trong `uma_data.js` được xử lý qua `characterDataOverrides` trong `characterRoutes.js`.
