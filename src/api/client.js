import axios from 'axios';

// Set VITE_API_URL in your Vercel project env vars / .env.local for dev.
// Falls back to a same-origin /api path if not set (useful if you ever
// proxy the backend behind the same domain).
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL });

export default api;
