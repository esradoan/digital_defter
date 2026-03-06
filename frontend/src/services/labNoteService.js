import api from './api';

const labNoteService = {
    getAll: async (month = '', sortOrder = 'desc') => {
        let url = '/labnotes';
        const params = new URLSearchParams();
        if (month && month !== 'all') params.append('month', month);
        if (sortOrder) params.append('sortOrder', sortOrder);

        if (params.toString()) {
            url += '?' + params.toString();
        }
        const response = await api.get(url);
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
    },

    exportToCsv: async () => {
        const response = await api.get('/labnotes/export/csv', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        link.setAttribute('download', `LabNotes_Export_${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};

export default labNoteService;
