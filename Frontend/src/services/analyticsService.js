import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const getAuthToken = () => localStorage.getItem('token');

const analyticsService = {
    getMentorSummary: async (timeframe = 'last30days') => {
        try {
            const response = await axios.get(`${API_URL}/analytics/summary?timeframe=${timeframe}`, {
                headers: { Authorization: `Bearer ${getAuthToken()}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    },

    exportReport: async () => {
        try {
            const response = await axios.get(`${API_URL}/analytics/export`, {
                headers: { Authorization: `Bearer ${getAuthToken()}` },
                responseType: 'blob'
            });

            // Create a link to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `MentorLink_Performance_Report_${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting report:', error);
            throw error;
        }
    }
};

export default analyticsService;
