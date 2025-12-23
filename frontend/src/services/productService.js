import api from './api';

const productService = {
    // Tüm ürünleri getir
    getAll: async () => {
        const response = await api.get('/products');
        return response.data.data; // ApiResponse wrapper'ından data'yı çıkar
    },

    // Id'ye göre getir
    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data.data;
    },

    // Ürün oluştur
    create: async (data) => {
        const response = await api.post('/products', data);
        return response.data.data;
    },

    // Güncelle
    update: async (id, data) => {
        const response = await api.put(`/products/${id}`, data);
        return response.data.data;
    },

    // Sil
    delete: async (id) => {
        await api.delete(`/products/${id}`);
    },

    // Kategoriye göre getir
    getByCategory: async (categoryId) => {
        const response = await api.get(`/products/by-category/${categoryId}`);
        return response.data.data;
    }
};

export default productService;

