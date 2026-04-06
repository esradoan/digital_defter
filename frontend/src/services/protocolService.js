import api from './api';

const getFileNameFromDisposition = (contentDisposition) => {
    if (!contentDisposition) return null;

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
        return decodeURIComponent(utf8Match[1]);
    }

    const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
    if (basicMatch?.[1]) {
        return basicMatch[1];
    }

    return null;
};

const getBlobFromResponse = (response, fallbackContentType) => {
    if (response.data instanceof Blob) {
        return response.data;
    }

    return new Blob([response.data], {
        type: fallbackContentType || response.headers['content-type'] || 'application/octet-stream'
    });
};

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
        const blob = getBlobFromResponse(response, response.headers['content-type']);
        return window.URL.createObjectURL(blob);
    },

    downloadFile: async (protocolOrId) => {
        const protocol = typeof protocolOrId === 'object' && protocolOrId !== null ? protocolOrId : null;
        const id = protocol?.id ?? protocolOrId;
        const response = await api.get(`/protocols/${id}/download`, {
            responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        const fileName = getFileNameFromDisposition(contentDisposition) || protocol?.fileName || 'protokol';
        const blob = getBlobFromResponse(response, protocol?.contentType);

        const url = window.URL.createObjectURL(blob);
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
