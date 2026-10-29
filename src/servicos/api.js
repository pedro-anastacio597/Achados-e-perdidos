import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api-achados.jefersonqueiroga.com.br',
    headers: {
        'X-API-KEY': import.meta.env.VITE_API_KEY || '',
        "Content-Type": 'application/json'
    },
});

api.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const token = localStorage.getItem('token');

  if (apiKey) {
    config.headers['X-API-KEY'] = apiKey;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;