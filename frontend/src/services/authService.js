import api from './api';

const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        const data = response.data.data || response.data;

        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                username: data.username,
                email: data.email,
                fullName: data.fullName,
                role: data.role
            }));
        }

        return data;
    },

    register: async (username, email, password, fullName) => {
        const response = await api.post('/auth/register', {
            username,
            email,
            password,
            fullName
        });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken: () => localStorage.getItem('token'),

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => !!localStorage.getItem('token')
};

export default authService;
