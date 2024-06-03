import { getAPI, postAPI } from "../utils/httpService"

export const getListChatsAPI = (params?: any) => {
    return getAPI(`chat/list?limit=${params?.limit || 10}&offset=${params?.offset || 0}`);
}

// export const getListMessageAPI = () => {
//     return getAPI(``);
// }

export const sendMessageAPI = (data?: any) => {
    return postAPI(`chat/send-chat`, data);
}