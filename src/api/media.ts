import { postAPI } from "../utils/httpService";

export const uploadFileAPI = (data: any) => {
    return postAPI('upload', data, { 'Content-Type': 'multipart/form-data' });
}