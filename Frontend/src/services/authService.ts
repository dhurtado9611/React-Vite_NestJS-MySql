import api from './api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const { access_token } = response.data;

  // Guardar token en LocalStorage
  localStorage.setItem('token', access_token);

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
