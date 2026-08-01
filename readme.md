# 📅 Social Media Automation

A full-stack application that lets you **generate AI-powered social media posts** (text + image) and **schedule them** across multiple platforms — all from one dashboard.

---

## ✨ Features

- 🤖 **AI Post Generation** — Generates post content and a matching image prompt via **Google Gemini 2.5 Flash**
- 🖼️ **AI Image Generation** — Optionally generates images via **Google Imagen 3** and uploads them to **Cloudinary**
- 📆 **Post Scheduling** — Schedule posts to Instagram, Twitter/X, and Facebook with a chosen date/time
- 📁 **Media Upload** — Attach your own image or video to a scheduled post via multipart form upload
- 🔐 **JWT Authentication** — Secure register/login flow with protected API routes
- 🗄️ **MongoDB** — Persistent storage for users, generated content, and scheduled posts

---

## 🏗️ Tech Stack

### Backend (`/server`)
| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Language | TypeScript (`tsx` for dev) |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| AI | `@google/genai` (Gemini & Imagen) |
| Storage | Cloudinary |
| File Upload | Multer |
| Validation | Zod |

### Frontend (`/client`)
| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Icons | Lucide React, Simple Icons |

---


## 📁 Project Structure

```
social-media-automation/
├── client/               # React + Vite frontend
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route-level page components
│       └── App.tsx
│
└── server/               # Express backend
    ├── docker-compose.yml  # MongoDB container setup
    └── src/
        ├── config/         # DB, Cloudinary, Multer config
        ├── controllers/    # Route handlers (auth, posts)
        ├── middleware/     # JWT auth middleware
        ├── models/         # Mongoose schemas (User, Post, Generation)
        ├── routes/         # Express routers
        ├── services/       # External service integrations
        └── utils/          # Helper utilities
```

---

## 🔌 API Reference

### Auth — `api/auth/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and receive a JWT | ❌ |

### Posts — `api/posts/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Get all scheduled posts for the user | ✅ |
| `POST` | `/` | Schedule a new post (supports file upload) | ✅ |
| `GET` | `/generations` | Get all AI-generated content | ✅ |
| `POST` | `/generate` | Generate post content + image via AI | ✅ |

#### `POST /api/posts/generate` — Body (JSON)
```json
{
  "prompt": "Announce our summer sale",
  "tone": "exciting",
  "generateImage": true
}
```

#### `POST /api/posts/` — Body (multipart/form-data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | ✅ | Post text |
| `platform` | string (JSON array) | ✅ | e.g. `'["instagram","twitter"]'` |
| `scheduledFor` | ISO 8601 date string | ✅ | When to publish |
| `status` | `draft` \| `scheduled` | ❌ | Defaults to `scheduled` |
| `mediaUrl` | string | ❌ | URL of a previously uploaded asset |
| `media` | file | ❌ | Upload an image or video directly |

---

## 🗃️ Data Models

### `Post`
| Field | Type | Values |
|-------|------|--------|
| `content` | String | Required |
| `mediaUrl` | String | Optional |
| `mediaType` | String | `image` \| `video` \| `none` |
| `platform` | String[] | `instagram` \| `twitter` \| `facebook` \| `X` |
| `scheduledFor` | Date | Required |
| `status` | String | `draft` \| `scheduled` \| `published` \| `failed` |

### `Generation`
| Field | Type | Description |
|-------|------|-------------|
| `prompt` | String | The user's input prompt |
| `content` | String | AI-generated post text |
| `mediaUrl` | String | Cloudinary URL of generated image |
| `mediaType` | String | `none` \| `image` \| `video` |
| `tone` | String | Tone used for generation |

---

## ⚙️ Environment Variables

Create a `.env` file inside `server/`:

```env
# Server
PORT=3000

# MongoDB
MONGO_URI=mongodb://admin:hardwork@localhost:27018/socialscheduler?authSource=admin

# JWT
JWT_SECRET=your_jwt_secret

# Google AI
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Docker & Docker Compose (for MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/social-media-automation.git
cd social-media-automation
```

### 2. Start MongoDB
```bash
cd server
docker compose up -d
```

### 3. Start the backend
```bash
cd server
npm install
npm run dev
```
Server runs at `http://localhost:3000`.

### 4. Start the frontend
```bash
cd client
npm install
npm run dev
```
Client runs at `http://localhost:5173`.

---

## 📜 License

MIT
