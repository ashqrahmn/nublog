# 📰 NuBlog

**NuBlog** is a full‑stack personal blog site built with **React** (frontend) and **Node.js / Express** (backend). It uses **Tailwind CSS** for design, **Mongoose** for database modeling, **bcrypt** for password security, **JWT** for admin authentication, and **ImageKit** for media storage and optimization.

## 🚀 Features

### 👤 Admin Features
- ➕ Create New Blog Posts  
- 👁️ View All Blog Posts  
- ❌ Delete Blog Posts  
- ➕ Add New Categories  
- 👁️ View Category List  
- ❌ Delete Categories  
- 👥 View Subscription List  
- ❌ Delete Subscriptions  
- ⚙️ Change Admin Password and Update Profile Photo  

### 👥 User Features
- 👁️ View Blog Posts  
- 📤 Share Blog Posts  
- 📧 Subscribe via Email to Receive New Blog Notifications  

## ⚙️ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2️⃣ Install Dependencies

#### Frontend
```bash
cd frontend && npm install
```

#### Backend
```bash
cd backend && npm install
```

### 3️⃣ Setup Environment Variables

#### Frontend (`frontend/.env`)
```
VITE_BASE_URL=
```

#### Backend (`backend/.env`)
```
JWT_SECRET=
REFRESH_SECRET=
MONGODB_URI=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
NEXT_PUBLIC_SITE_URL=
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=
BREVO_API_URL=
PORT=
```

### 4️⃣ Seeding the Admin Account

Since this is a personal blog site, the admin account must be seeded into the database using a script.

#### ⚡️ How to Seed
1. Make sure you are in the **backend** directory:
```bash
cd backend
```
2. Ensure your `.env` file is configured (`MONGODB_URI`, `JWT_SECRET`, etc.)
3. Run the seed script:
```bash
node scripts/seedAdmin.js
```
4. This will create the initial Admin account in the database, adding:
- `username` — The admin username defined in the script  
- `password` — The admin password defined in the script (bcrypt‑hashed)  
- `profileImage` — The admin profile image defined in the script  
- `author` — The Author Name used for blog attribution

#### 🔐 Admin Login
- URL: `/admin/login`  
- Use the seeded username and password  
- You can later change password and update profile photo from the dashboard

### 5️⃣ Start the Application

#### Frontend
Make sure you are in the frontend directory:
```bash
cd frontend
npm run dev
```

#### Backend
Make sure you are in the backend directory:
```bash
cd backend
npm run dev
```

## 🖳 Folder Structure

### Frontend
```
frontend/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── BlogItem.jsx
│   │   ├── BlogList.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── Login.jsx
│   ├── Pages/
│   │   ├── admin/
│   │   │   ├── AddBlog.jsx
│   │   │   ├── AddCategory.jsx
│   │   │   ├── AllBlogs.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Subscription.jsx
│   │   ├── table/
│   │   │   ├── BlogTable.jsx
│   │   │   ├── CategoryTable.jsx
│   │   │   └── SubscriptionTable.jsx
│   │   ├── BlogPage.jsx
│   │   └── Unsubscribe.jsx
│   ├── utils/
│   │   └── axiosInstance.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

### Backend
```
backend/
├── middleware/
│   ├── upload.js
│   ├── verifyAccessToken.js
│   └── verifyRefreshToken.js
├── models/
│   ├── AdminModel.js
│   ├── BlogModel.js
│   ├── CategoryModel.js
│   └── EmailModel.js
├── node_modules/
├── scripts/
│   └── seedAdmin.js
├── utils/
│   └── sendNewPostEmail.js
├── .env
├── .gitignore
├── index.js
├── package-lock.json
└── package.json
```

## 🖼️ Image Management

NuBlog uses ImageKit to upload and optimize images. Blog cover photos are shown in 1280×720 resolution, and admin profile photos are served at 192×192.

## 📧 Notifications

Supports email subscriptions for notifying readers about new blog posts via the Brevo API.
