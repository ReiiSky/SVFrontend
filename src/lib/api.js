// Default same-origin ('') agar request dev lewat Vite proxy (bebas CORS).
// Isi VITE_API_BASE_URL hanya jika backend sudah mengizinkan CORS
// atau frontend + backend di-deploy di origin yang sama lewat reverse proxy.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    throw new Error(`Request failed (${res.status})`);
  }
  if (!res.ok || body?.status === 'failed') {
    throw new Error(body?.message || `Request failed (${res.status})`);
  }
  return body?.data ?? null;
}

export function listArticles({ offset = 0, limit = 1000 } = {}) {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  return request(`/article?${params.toString()}`);
}

export function getArticle(id) {
  return request(`/article/${id}`);
}

export function createArticle({ title, content, category, status }) {
  return request('/article', {
    method: 'POST',
    body: JSON.stringify({ title, content, category, status }),
  });
}

export function updateArticle(id, { title, content, category, status }) {
  return request(`/article/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content, category, status }),
  });
}

export function deleteArticle(id) {
  return request(`/article/${id}`, { method: 'DELETE' });
}

export { BASE_URL };
