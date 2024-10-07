import { getAPI, postAPI } from "../utils/httpService"

export const getListChatsAPI = (params?: any) => {
    return getAPI(`chat/list?limit=${params?.limit || 10}&offset=${params?.offset || 0}`);
}

export const getListMessageAPI = (params?: any) => {
    return getAPI(`chat/messages?chatId=${params.chatId}&userId=${params.userId}&offset=${params.offset}&limit=${params.limit}`);
}

export const sendMessageAPI = (data?: any) => {
    return postAPI(`chat/send-chat`, data);
}

export const updateStatusReadAPI = (params?: any) => {
    return postAPI(`chat/update-status/${params}`, {});
}