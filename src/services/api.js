import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Futuramente virá do .env

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pra adicionar token futuramente
api.interceptors.request.use((config) => {
  // TODO: Pegar token do AsyncStorage e adicionar ao header
  // const token = await AsyncStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor pra tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Tratar erros globais (401, 500, etc.)
    return Promise.reject(error);
  }
);

export default api;
