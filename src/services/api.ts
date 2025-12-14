import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/',
  withCredentials: true,
  withXSRFToken: true,
});

export const getCsrfCookie = () => {
    return axios.get(
        (import.meta.env.VITE_SANCTUM_URL || 'http://localhost/') + 'sanctum/csrf-cookie',
        { withCredentials: true }
    );
}

export default api;
