import api from './api';

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

    getPreviewBlobUrl: async (id) => {
        const response = await api.get(`/protocols/${id}/download`, {
            responseType: 'blob',
        });
        return window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    },

    downloadFile: async (id) => {
        const response = await api.get(`/protocols/${id}/download`, {
            responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'protokol.pdf';
        if (contentDisposition) {
            const match = contentDisposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
            if (match) fileName = decodeURIComponent(match[1].replace(/"/g, ''));
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
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
