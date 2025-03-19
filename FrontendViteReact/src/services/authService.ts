import api from './api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const token = response.data.access_token;

  if (token) {
    localStorage.setItem('token', token);
  }

  return token;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};
