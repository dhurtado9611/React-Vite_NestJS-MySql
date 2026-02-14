// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. INTERCEPTOR DE SOLICITUD (REQUEST)
// Agrega el token a cada petición saliente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. INTERCEPTOR DE RESPUESTA (RESPONSE) - ¡MEJORA CRÍTICA!
// Detecta si el token venció o es inválido para sacar al usuario
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 (No autorizado), forzamos el cierre de sesión
    if (error.response && error.response.status === 401) {
      logout(); // Llamamos a la función de limpieza
    }
    return Promise.reject(error);
  }
);

/**
 * Función reutilizable para cerrar sesión.
 * Úsala en tu botón de "Cerrar Sesión" en el Navbar o Sidebar.
 */
export const logout = () => {
  localStorage.removeItem('token'); // Borra el token
  localStorage.removeItem('user');  // Si guardas datos del usuario, bórralos también
  // Redirige al login y recarga para limpiar estados de memoria (Redux/Context)
  window.location.href = '/'; 
};

export default api;