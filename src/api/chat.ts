import { getAPI } from "../utils/httpService"

export const getListChatsAPI = (params?: any) => {
    return getAPI(`chat/list?limit=${params?.limit || 10}&offset=${params?.offset || 0}`);
}