import axios from 'axios';

// Lee de la variable de entorno o usa '/api' por defecto para proxy Nginx/Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('uis_jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper de extracción de errores detallados del backend
export const getErrorMessage = (error) => {
    if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
        return Object.values(error.response.data.errors).join(' | ');
    }
    return error.response?.data?.message || 'Error en la petición al servidor';
};