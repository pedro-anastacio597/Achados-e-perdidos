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

  if (!apiKey) {
    console.error("❌ ERRO: A variável VITE_API_KEY está vazia ou não foi encontrada no .env!");
  } else {
    config.headers['X-API-KEY'] = apiKey;
    console.log("🔑 Requisição enviada com a chave:", apiKey);
  }

  return config;
});

export default api;