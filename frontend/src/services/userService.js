import api from './api';

const userService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data.data || response.data;
    },

    approve: async (id) => {
        const response = await api.put(`/users/${id}/approve`);
        return response.data.data || response.data;
    },

    delete: async (id) => {
        await api.delete(`/users/${id}`);
    }
};

export default userService;
