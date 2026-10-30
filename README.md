# Dashboard Blog

Dashboard blog sederhana: All Posts, Add New, Preview. Data dari API SharingVision (Gin/Go).

## Prasyarat

Backend jalan di `http://localhost:3000` (lihat `API_SPEC.md`).

## Install & Jalan

```bash
npm i
npm run dev
```

Build:

```bash
npm run build
```

## Konfigurasi API

Default request same-origin (`''`) dan diteruskan ke `http://localhost:3000`
lewat Vite proxy (`vite.config.js`), jadi tidak kena CORS saat `npm run dev`.

Backend saat ini hanya mengirim `Access-Control-Allow-Origin` di preflight
`OPTIONS`, tidak di response `GET/POST/PUT/DELETE` — karena itu akses langsung
ke `http://localhost:3000` dari browser diblokir. Jangan isi `VITE_API_BASE_URL`
kecuali backend sudah diperbaiki (kirim header CORS di semua response) atau
deploy satu origin. Contoh ada di `.env.example`.

## Struktur Folder

```
src/
├── main.jsx
├── App.jsx
├── lib/api.js               # fetch ke /article (satu-satunya akses HTTP)
├── store/PostsContext.jsx   # state + aksi (satu-satunya sumber data)
├── components/Layout.jsx
├── components/PostForm.jsx
└── pages/AllPosts.jsx
└── pages/AddPost.jsx
└── pages/EditPost.jsx
└── pages/Preview.jsx
```

## Catatan

- List & filter client-side dari `GET /article?offset=0&limit=1000` (diurutkan `id` desc).
- Tombol trash = `PUT /article/:id` dengan `status: trash` (bukan `DELETE`), supaya tab Trashed tetap berfungsi. `DELETE` (soft-delete) tidak dipakai karena plan tidak punya hapus permanen.
- Validasi form mengikuti backend: title 20-60, content 200-800, category 3-30 karakter.
- Error backend ditampilkan lewat `Alert`, list gagal load bisa `Retry`.
