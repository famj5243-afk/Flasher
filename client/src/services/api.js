import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all templates
export const getTemplates = async () => {
  try {
    const response = await api.get('/templates');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Get a specific template
export const getTemplate = async (id) => {
  try {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Send an email
export const sendEmail = async (emailData) => {
  try {
    const response = await api.post('/emails/send', emailData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to send email');
  }
};

// Render a template with variables
export const renderTemplate = async (id, variables) => {
  try {
    const response = await api.post(`/templates/${id}/render`, variables);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default api;
