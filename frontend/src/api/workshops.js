import apiClient from "./client";

export const getWorkshops = async () => {
    const response = await apiClient.get('/workshops/');
    return response.data;
};

export const getWorkshop = async (id) => {
    const response = await apiClient.get(`/workshops/${id}/`);
    return response.data;
};

export const proposeWorkshop = async (workshopData) => {
    const response = await apiClient.post('/workshops/', workshopData);
    return response.data;
}

export const acceptWorkshop = async (id) => {
    const response = await apiClient.post(`/workshops/${id}/accept/`);
    return response.data;
}

export const changeWorkshopDate = async (id, newDate) => {
    const response = await apiClient.post(`/workshops/${id}/change_date/`, {
        new_date: newDate,
    });
    return response.data;
}

export const getWorkshopTypes = async () => {
    const response = await apiClient.get('/workshop-types/');
    return response.data;
}

export const createWorkshop = async (workshopData) => {
    const response = await apiClient.post('/workshops/', workshopData)
    return response.data;
}

export const getComments = async (workshopId) => {
    const response = await apiClient.get(`/comments/?workshop=${workshopId}`);
    return response.data;
}

export const postComment = async (commentData) => {
    const response = await apiClient.post('/comments/', commentData);
    return response.data;
}

export const getWorkshopStats = async (params = {}) => {
    const response = await apiClient.get('/stats/', { params });
    return response.data;
}

export const getMyProfile = async () => {
    const response = await apiClient.get('/profile/me/');
    return response.data;
}

export const updateProfile = async (profileData) => {
    const response = await apiClient.put('/profile/update/', profileData);
    return response.data;
}

