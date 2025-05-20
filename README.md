# PlanIT

PlanIT adalah aplikasi manajemen jadwal yang dirancang untuk membantu pengguna mengatur jadwal pribadi, grup, dan kolaborasi dengan teman. Aplikasi ini mendukung fitur seperti pembuatan jadwal, pengelolaan grup, dan berbagi jadwal dengan teman.

# 💻 Tech Stack:

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) 
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) 
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) 
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

# :bar_chart: Diagram

## UML
![UML Diagram](https://i.imgur.com/bz2i5z1.png)

## ERD
![ERD Diagram](https://github.com/user-attachments/assets/16796295-518d-4b59-8181-cb15beb1e6a0)
)

## Flowchart
![Flowchart](https://via.placeholder.com/800x400?text=Flowchart)
)

# :computer: Installation Guide

## Clone Repository

Clone repository ini ke komputer Anda:

```
git clone https://github.com/username/PlanIT.git
```

## Frontend

1. **Masuk ke folder frontend**:
   ```
   cd frontend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Jalankan aplikasi**:
   ```
   npm run dev
   ```

4. **Akses aplikasi di browser**:
   ```
   http://localhost:5173
   ```

## Backend

1. **Masuk ke folder backend**:
   ```
   cd backend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Buat file `.env`**:
   Tambahkan variabel berikut ke file `.env`:
   ```
   PORT=5000
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   DB_HOST=your_database_host
   DB_PORT=your_database_port
   JWT_SECRET=your_jwt_secret
   ```

4. **Jalankan server**:
   ```
   npm run start
   ```

5. **Akses API di browser atau Postman**:
   ```
   http://localhost:5000
   ```

# 💻 Progress Report:

## Fitur yang Sudah Selesai:
- [x] Autentikasi pengguna (Login & Register)
- [x] Pembuatan dan pengelolaan jadwal pribadi
- [x] Pembuatan grup dan pengelolaan anggota grup
- [x] Pembuatan jadwal grup
- [x] Berbagi jadwal dengan teman
- [x] Tampilan kalender interaktif

## Fitur yang Sedang Dikembangkan:
- [ ] Notifikasi real-time untuk perubahan jadwal
- [ ] Integrasi dengan Google Calendar

## Tampilan Aplikasi:
### Halaman Login
![Login Page](https://via.placeholder.com/800x400?text=Login+Page)

### Halaman Kalender
![Calendar Page](https://via.placeholder.com/800x400?text=Calendar+Page)

### Halaman Grup
![Groups Page](https://via.placeholder.com/800x400?text=Groups+Page)

# :rocket: Deployment

Aplikasi ini dapat dideploy menggunakan platform seperti [Vercel](https://vercel.com/) untuk frontend dan [Railway](https://railway.app/) untuk backend.

## Langkah Deployment:

### Frontend:
1. **Build aplikasi**:
   ```
   npm run build
   ```

2. **Deploy ke Vercel**:
   Ikuti panduan di [Vercel Docs](https://vercel.com/docs).

### Backend:
1. **Deploy ke Railway**:
   Ikuti panduan di [Railway Docs](https://docs.railway.app/).

