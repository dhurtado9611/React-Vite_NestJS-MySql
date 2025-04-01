import api from './api';

export const login = async (username: string, password: string) => {
  try {
    const res = await api.post('/auth/login', { username, password });
    const token = res.data.access_token;

    // Guarda el token
    localStorage.setItem('token', token);

    // Extrae y guarda el username y rol si vienen en la respuesta
    if (res.data.username) {
      localStorage.setItem('username', res.data.username);
    }
    if (res.data.rol) {
      localStorage.setItem('rol', res.data.rol);
    }

    return true;
  } catch (err) {
    console.error('❌ Error en login', err);
    return false;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('rol');
  localStorage.removeItem('username');
};