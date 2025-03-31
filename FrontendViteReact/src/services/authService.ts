import api from './api';

export const login = async (username: string, password: string) => {
  try {
    const res = await api.post('/auth/login', { username, password });
    const token = res.data.access_token;
    localStorage.setItem('token', token);
    return true;
  } catch (err) {
    console.error('❌ Error en login', err);
    return false;
  }
};
