import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Toma desde .env
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la respuesta de la API BackendNestJS:', error);
    return Promise.reject(error);
  }
);

export default api;