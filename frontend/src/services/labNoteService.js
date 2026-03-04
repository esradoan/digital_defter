import api from './api';

const labNoteService = {
    getAll: async () => {
        const response = await api.get('/labnotes');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/labnotes/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/labnotes', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/labnotes/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/labnotes/${id}`);
        return response.data;
    }
};

export default labNoteService;
