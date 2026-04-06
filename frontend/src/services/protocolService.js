import api, { API_URL } from './api';

const protocolService = {
    getAll: async () => {
        const response = await api.get('/protocols');
        return response.data.data || response.data;
    },

    upload: async (formData) => {
        const response = await api.post('/protocols', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data || response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/protocols/${id}`);
        return response.data;
    },

    getDownloadUrl: (id) => {
        return `${API_URL}/protocols/${id}/download`;
    },

    // Kategori işlemleri
    getCategories: async () => {
        const response = await api.get('/protocols/categories');
        return response.data.data || response.data;
    },

    createCategory: async (data) => {
        const response = await api.post('/protocols/categories', data);
        return response.data.data || response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/protocols/categories/${id}`);
        return response.data;
    }
};

export default protocolService;
