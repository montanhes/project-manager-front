import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
  withCredentials: true,
  withXSRFToken: true,
});

export const getCsrfCookie = async () => {
    // We need to change the baseURL to get the cookie from the correct domain
    const originalBaseURL = api.defaults.baseURL;
    api.defaults.baseURL = import.meta.env.VITE_SANCTUM_URL || 'http://localhost/';
    await api.get('/sanctum/csrf-cookie');
    api.defaults.baseURL = originalBaseURL;
}

export default api;
