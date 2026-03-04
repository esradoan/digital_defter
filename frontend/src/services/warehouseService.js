import api from './api';

const warehouseService = {
    // Depo CRUD
    getAll: async () => {
        const response = await api.get('/warehouses');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/warehouses', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/warehouses/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/warehouses/${id}`);
        return response.data;
    },

    // Depo ürünleri
    getItems: async (warehouseId) => {
        const response = await api.get(`/warehouses/${warehouseId}/items`);
        return response.data;
    },
    createItem: async (data) => {
        const response = await api.post('/warehouses/items', data);
        return response.data;
    },
    updateItem: async (id, data) => {
        const response = await api.put(`/warehouses/items/${id}`, data);
        return response.data;
    },
    deleteItem: async (id) => {
        const response = await api.delete(`/warehouses/items/${id}`);
        return response.data;
    },

    // Kategoriler
    getCategories: async () => {
        const response = await api.get('/warehouses/categories');
        return response.data;
    },
    createCategory: async (name, description) => {
        const response = await api.post('/warehouses/categories', { name, description });
        return response.data;
    },
    deleteCategory: async (id) => {
        const response = await api.delete(`/warehouses/categories/${id}`);
        return response.data;
    }
};

export default warehouseService;
