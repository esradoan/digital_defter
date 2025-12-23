import api from './api';

const categoryService = {
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data.data || response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data.data || response.data;
    }
};

export default categoryService;
