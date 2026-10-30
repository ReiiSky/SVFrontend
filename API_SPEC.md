# Spesifikasi API — SharingVision Backend

Base URL: `http://localhost:3000` (env `PORT`, default `3000`)
Framework: Gin (Go). Format semua response JSON dengan envelope:

```json
{ "status": "success | failed", "message": "opsional", "data": "object | array | null" }
```

Error umum:
- `400` body bukan JSON valid → `{ "status": "failed", "message": "invalid parse body", "data": null }`
- `400` validasi gagal → `{ "status": "failed", "message": "invalid value of ...", "data": null }`
- `404` tidak ketemu → `{ "status": "failed", "message": "article not found", "data": null }`
- `500` gagal server/DB → `{ "status": "failed", "message": "<pesan error>", "data": null }`

## Model Article

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | int | Auto increment (`posts.id`) |
| `title` | string | Wajib, 20–60 karakter |
| `content` | string | Wajib, 200–800 karakter |
| `category` | string | Wajib, 3–30 karakter |
| `status` | string | Wajib, salah satu: `publish`, `draft`, `trash` |

Catatan: list & detail hanya tampilkan data yang belum di-soft-delete (`deleted_at IS NULL`), diurutkan `id` desc (terbaru dulu). Delete bersifat soft-delete (`deleted_at = now()`).

---

## 1. Buat Article

- `POST /article`
- Body (JSON, semua wajib):

```json
{ "title": "judul 20-60 karakter", "content": "isi 200-800 karakter", "category": "tech", "status": "publish" }
```

- Sukses `201`:

```json
{ "status": "success", "message": "article created", "data": null }
```

- Gagal: `400` (body tidak valid / validasi), `500`.

## 2. List Article

- `GET /article?offset=0&limit=10`
- Query (opsional):
  - `offset` — default `0`, min `0`. Invalid → `0`.
  - `limit` — default `10`, min `1`. Invalid → `10`, nilai ≤1 → `1`.
- Sukses `200`:

```json
{ "status": "success", "message": "article retrieved", "data": [{ "id": 1, "title": "...", "content": "...", "category": "...", "status": "publish" }] }
```

- Gagal: `500`.
- Contoh: `GET /article`, `GET /article?offset=10&limit=5`.

## 3. Detail Article

- `GET /article/:id`
- Contoh: `GET /article/1`
- Sukses `200`:

```json
{ "status": "success", "message": "article found", "data": { "id": 1, "title": "...", "content": "...", "category": "...", "status": "draft" } }
```

- Gagal: `404` jika id tidak ada / sudah dihapus, `500`.

## 4. Update Article

- `PUT /article/:id`
- Body sama persis seperti `POST /article` (full replace: `title`, `content`, `category`, `status`).
- Contoh: `PUT /article/1`
- Sukses `200`:

```json
{ "status": "success", "message": "article updated", "data": null }
```

- Gagal: `400`, `404`, `500`.

## 5. Hapus Article (soft-delete)

- `DELETE /article/:id`
- Contoh: `DELETE /article/1`
- Sukses `200`:

```json
{ "status": "success", "message": "article deleted", "data": null }
```

- Gagal: `404`, `500`.

---

Sumber: `cmd/rest/main.go` (routing), `application/*_controller.go`, `application/dto/create_article_input.go`, `domain/article.go`.
