import { getAPI, postAPI } from "../utils/httpService"

export const getProfile = () => {
    return getAPI('user');
}

export const updateProfile = (data: any) => {
    return postAPI('user/update-profile', data, { 'Content-Type': 'multipart/form-data' });
}