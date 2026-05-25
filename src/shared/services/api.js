/**
 * Base API client — shared across all feature services.
 * Automatically attaches the Supabase session token to every request.
 */

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
};

const getToken = () => localStorage.getItem('token');

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body instanceof FormData) delete headers['Content-Type'];

  const response = await fetch(`${getApiUrl()}${endpoint}`, { ...options, headers });
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) throw new Error('Server returned a non-JSON response. Check server logs.');

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Request failed with status ${response.status}`);
  return data;
}

export const api = {
  get:    (url)              => apiFetch(url, { method: 'GET' }),
  post:   (url, body)        => apiFetch(url, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (url, body)        => apiFetch(url, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (url)              => apiFetch(url, { method: 'DELETE' }),
  patch:  (url, body)        => apiFetch(url, { method: 'PATCH',  body: JSON.stringify(body) }),
  upload: (url, formData, method = 'POST') => apiFetch(url, { method, body: formData }),
};
