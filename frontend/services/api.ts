import axios from 'axios';

// Define the base URL for your backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token if available
apiClient.interceptors.request.use(
    (config) => {
        // Retrieve the token from local storage (or wherever you store it after login)
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Define functions for your API endpoints

// --- Auth ---
export const loginUser = async (credentials: any) => { // Define specific type later
    const response = await apiClient.post('/auth/login', credentials);
    // Store token upon successful login (e.g., in local storage)
    if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        // You might want to store user info as well
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const registerUser = async (userData: any) => { // Define specific type later
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
};

export const logoutUser = () => {
    // Remove token and user info from storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    // Optionally redirect or update state
};


// --- Applications ---
export const getApplications = async () => {
    const response = await apiClient.get('/applications');
    return response.data;
};

export const createApplication = async (applicationData: any) => { // Define specific type later
    const response = await apiClient.post('/applications', applicationData);
    return response.data;
};

export const getApplicationById = async (id: string | number) => {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
};

export const updateApplication = async (id: string | number, applicationData: any) => { // Define specific type later
    const response = await apiClient.put(`/applications/${id}`, applicationData);
    return response.data;
};

export const deleteApplication = async (id: string | number) => {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data; // Or just status code
};

export default apiClient; // Export the configured instance if needed elsewhere