# PLAN: Dashboard Blog (Tes Frontend Sharing Vision 2023)

Dokumen ini adalah instruksi untuk coding agent. Ikuti urutan langkah, jangan menambah fitur atau UI di luar yang tertulis.

## 1. Tujuan

Bangun dashboard blog sederhana dengan 3 halaman: **All Posts**, **Add New**, **Preview**.

| # | Requirement | Bobot |
|---|-------------|-------|
| 1 | All Posts: tabs Published / Drafts / Trashed, tabel (Title, Category, Action), edit + trash | 40 |
| 2 | Add New: form Title, Content, Category + tombol Publish & Draft | 20 |
| 3 | Preview: daftar article berstatus Publish + pagination | 20 |

Rincian poin 1: tabel 10, halaman edit 20, trash 10. Total poin tertulis di soal 80 dari 100, jadi sisanya kemungkinan dinilai dari kerapian kode dan UI. Itulah alasan struktur dibuat rapi dan sederhana.

## 2. Prinsip (wajib diikuti)

- **Minimalis & mudah di-maintain**: sedikit file, satu tanggung jawab per file, tanpa abstraksi berlebihan.
- **Stack**: React (Vite, JavaScript) + Material UI. Tidak ada TypeScript, Redux, form library, atau library tanggal.
- **Dependency yang boleh**: `react`, `react-dom`, `react-router-dom`, `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`. Selain itu tidak boleh.
- **Styling**: hanya komponen MUI + prop `sx`. Tanpa file CSS kustom, tanpa tema kustom.
- **Tanpa backend**: data disimpan di `localStorage` lewat satu file store, sehingga mudah diganti dengan API nanti.
- **Tanpa fitur ekstra**: tidak ada auth, search, rich text editor, dark mode, atau animasi.

## 3. Data Model

```js
// Post
{
  id: string,            // crypto.randomUUID()
  title: string,
  content: string,
  category: string,
  status: 'publish' | 'draft' | 'trash',
  updatedAt: number      // Date.now()
}
```

Mapping tab → status: Published = `publish`, Drafts = `draft`, Trashed = `trash`.

## 4. Struktur Folder

```
src/
├── main.jsx                 # render App + BrowserRouter
├── App.jsx                  # definisi routes + PostsProvider
├── store/
│   └── PostsContext.jsx     # state + localStorage + aksi (satu-satunya sumber data)
├── components/
│   ├── Layout.jsx           # Drawer kiri (3 menu) + <Outlet />
│   └── PostForm.jsx         # form dipakai Add New & Edit
└── pages/
    ├── AllPosts.jsx         # tabs + tabel
    ├── AddPost.jsx          # PostForm kosong
    ├── EditPost.jsx         # PostForm terisi data
    └── Preview.jsx          # card list + pagination
```

## 5. Routes

| Path | Halaman | Menu sidebar |
|------|---------|--------------|
| `/` | redirect ke `/posts` | – |
| `/posts` | AllPosts | All Posts |
| `/posts/new` | AddPost | Add New |
| `/posts/:id/edit` | EditPost | – |
| `/preview` | Preview (`?page=N`) | Preview |

## 6. Langkah Implementasi

### Step 1 – Setup
1. `npm create vite@latest . -- --template react`
2. Install dependency yang diizinkan (lihat bagian 2).
3. Hapus boilerplate Vite (`App.css`, `index.css`, aset contoh).

### Step 2 – Store (`store/PostsContext.jsx`)
- `PostsProvider` menyimpan `posts` di `useState`, inisialisasi dari `localStorage` (key `posts`), jika kosong pakai seed (±12 post `publish` agar pagination terlihat, 2 `draft`, 1 `trash`).
- `useEffect` menyimpan `posts` ke `localStorage` setiap berubah.
- Expose lewat hook `usePosts()`:
  - `posts`
  - `getPost(id)`
  - `savePost({ id?, title, content, category, status })` → jika `id` ada update, jika tidak buat baru (isi `id` & `updatedAt`)
  - `trashPost(id)` → set `status = 'trash'`
- Semua logika data HANYA di file ini. Halaman tidak boleh menyentuh `localStorage`.

### Step 3 – Layout (`components/Layout.jsx`)
- MUI `Drawer` permanen di kiri dengan `List` berisi 3 item: All Posts, Add New, Preview (`NavLink`/`ListItemButton component={Link}`), item aktif ditandai `selected`.
- Konten kanan: `Box` dengan padding + `<Outlet />`.

### Step 4 – PostForm (`components/PostForm.jsx`)
- Props: `initialValues` (opsional), `onSubmit(values, status)`.
- Field: `TextField` Title, `TextField multiline minRows={6}` Content, `TextField` Category.
- Dua tombol: **Publish** (`variant="contained"`) dan **Draft** (`variant="outlined"`).
- Validasi sederhana: ketiga field wajib diisi; jika kosong tampilkan `error` + `helperText` dan jangan submit.
- Komponen ini tidak tahu soal store atau router.

### Step 5 – Add New (`pages/AddPost.jsx`)
- Render `PostForm` kosong. Saat submit: `savePost({ ...values, status })` lalu `navigate('/posts')`.

### Step 6 – Edit (`pages/EditPost.jsx`)
- Ambil post dengan `getPost(id)`. Jika tidak ada, tampilkan `Alert` "Article not found".
- Render `PostForm` dengan `initialValues`. Saat submit: `savePost({ id, ...values, status })` lalu `navigate('/posts')`.
- Mengedit post di tab Trashed lalu menekan Publish/Draft akan memulihkannya (perilaku ini disengaja).

### Step 7 – All Posts (`pages/AllPosts.jsx`)
- State `tab` (`'publish' | 'draft' | 'trash'`), default `publish`.
- MUI `Tabs` dengan label Published, Drafts, Trashed.
- Filter `posts` berdasarkan `status === tab`.
- MUI `Table` dengan kolom **Title**, **Category**, **Action**.
- Action: `IconButton` edit (`EditIcon`) → `navigate('/posts/:id/edit')`; `IconButton` trash (`DeleteIcon`) → `trashPost(id)`.
- Di tab Trashed, tombol trash di-`disabled` (post sudah di trash).
- Jika list kosong, tampilkan satu baris "No articles".
- Tabel boleh diekstrak ke komponen kecil di file yang sama (bukan file baru) jika perlu.

### Step 8 – Preview (`pages/Preview.jsx`)
- Ambil post `status === 'publish'`, urutkan `updatedAt` desc.
- `PAGE_SIZE = 5` (konstanta di atas file).
- Halaman aktif dibaca dari query string `?page=N` (`useSearchParams`) supaya tetap saat refresh.
- Tampilkan tiap post sebagai MUI `Card` (title, category sebagai `Chip`, content).
- MUI `Pagination` di bawah, sembunyikan jika hanya 1 halaman.
- Jika tidak ada post publish, tampilkan "No published articles".

### Step 9 – Rapikan
- Pastikan tidak ada `console.log`, import tidak terpakai, atau file tidak terpakai.
- Tambah `README.md` singkat: cara install (`npm i`), jalan (`npm run dev`), struktur folder, dan catatan bahwa data disimpan di `localStorage`.

## 7. Asumsi (jangan ditanyakan, langsung ikuti)

- Tab Trashed tidak punya aksi hapus permanen, dan tidak ada tombol restore khusus (restore lewat Edit → Publish/Draft).
- Setelah Publish/Draft di form, user diarahkan ke `/posts`. Tab bawaan tetap Published.
- Category berupa teks bebas, bukan dropdown.
- Tidak ada batas minimum karakter pada field, hanya wajib diisi.

## 8. Acceptance Checklist

**All Posts**
- [ ] Tiga tab tampil dan memfilter sesuai status.
- [ ] Tabel punya kolom Title, Category, Action.
- [ ] Ikon edit membuka halaman edit dengan Title, Content, Category terisi.
- [ ] Halaman edit punya tombol Publish dan Draft, dan perubahan tersimpan.
- [ ] Ikon trash memindahkan article ke tab Trashed.

**Add New**
- [ ] Form Title, Content, Category + tombol Publish dan Draft.
- [ ] Publish → muncul di tab Published; Draft → muncul di tab Drafts.
- [ ] Field kosong tidak bisa disubmit.

**Preview**
- [ ] Hanya article `publish` yang tampil.
- [ ] Pagination berfungsi (5 per halaman) dan halaman bertahan saat refresh.
- [ ] Article yang di-trash atau di-draft hilang dari Preview.

**Umum**
- [ ] Data tetap ada setelah refresh.
- [ ] `npm run build` sukses tanpa error/warning.
- [ ] Tidak ada dependency di luar daftar yang diizinkan.

## 9. Output Akhir yang Diharapkan

Repo siap jalan dengan `npm i && npm run dev`, mengikuti struktur folder di bagian 4. Setelah selesai, agent cukup melaporkan: apa yang dibuat, hasil `npm run build`, dan asumsi yang dipakai.
