import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5274/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Her istekte JWT token'ı ekle
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 401 hatası gelirse logout yap
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Login sayfasına yönlendir (sayfa yenilemesiyle)
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
