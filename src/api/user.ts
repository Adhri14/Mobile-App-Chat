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

export const getUsersAPI = () => {
    return getAPI('user/list');
}

export const followUserAPI = (id: string) => {
    return postAPI(`user/follow/${id}`, {});
}