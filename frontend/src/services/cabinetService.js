import api from './api';

const cabinetService = {
    getAll: async () => {
        const response = await api.get('/storagelocations');
        return response.data.data || response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/storagelocations/${id}`);
        return response.data.data || response.data;
    },

    create: async (data) => {
        const response = await api.post('/storagelocations', data);
        return response.data.data || response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/storagelocations/${id}`, data);
        return response.data.data || response.data;
    },

    delete: async (id) => {
        await api.delete(`/storagelocations/${id}`);
    }
};

export default cabinetService;
