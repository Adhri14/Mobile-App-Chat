import { postAPIBasic } from "../utils/httpService";

export const registerDeviceAPI = (data: any) => {
    return postAPIBasic('device_info/register', data);
}