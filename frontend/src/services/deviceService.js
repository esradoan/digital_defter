import api from './api';

const deviceService = {
    getAll: async () => {
        const response = await api.get('/devices');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/devices', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/devices/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/devices/${id}`);
        return response.data;
    },

    // Kategori işlemleri
    getCategories: async () => {
        const response = await api.get('/devices/categories');
        return response.data;
    },

    createCategory: async (name, description) => {
        const response = await api.post('/devices/categories', { name, description });
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/devices/categories/${id}`);
        return response.data;
    }
};

export default deviceService;
