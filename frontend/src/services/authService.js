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
                role: data.role,
                profileImageUrl: data.profileImageUrl
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

    isAuthenticated: () => !!localStorage.getItem('token'),

    updateProfile: async (fullName, email) => {
        const response = await api.put('/auth/profile', { fullName, email });
        return response.data;
    },

    changePassword: async (currentPassword, newPassword) => {
        const response = await api.put('/auth/password', { currentPassword, newPassword });
        return response.data;
    },

    uploadProfilePicture: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/auth/profile-picture', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data || response.data;
    }
};

export default authService;
