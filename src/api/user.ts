import { getAPI, postAPI } from "../utils/httpService"

export const getProfile = () => {
    return getAPI('user');
}

export const getProfileById = (id: any) => {
    return getAPI('user/' + id);
}

export const updateProfile = (data: any) => {
    return postAPI('user/update-profile', data, { 'Content-Type': 'multipart/form-data' });
}

export const getUsersAPI = (params?: any) => {
    return getAPI(`user/list?search=${params?.search || ''}&offset=${params?.offset || 0}&limit=${params?.limit || 10}`);
}

export const followUserAPI = (id: string) => {
    return postAPI(`user/follow/${id}`, {});
}