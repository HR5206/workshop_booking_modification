import apiClient from './client';

export const loginUser = async (username, password) => {
    const response = await apiClient.post('/auth/login/', {
        username,
        password,
    });

    return response.data;
};

export const registerUser = async (userData) => {
    const response = await apiClient.post('/auth/register/', userData);
    return response.data;
}

export const logoutUser = async () => {
    const response = await apiClient.post('/auth/logout/');
    return response.data;
}
