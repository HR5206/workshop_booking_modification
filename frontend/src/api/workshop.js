import apiClient from './client'

export const getWorkshops = async () => {
    const response = await apiClient.get('/workshops/')
    return response.data
}

export const getWorkshopType = async (typeId) => {
    const response = await apiClient.get(`/workshop_types/${typeId}/`)
    return response.data
}