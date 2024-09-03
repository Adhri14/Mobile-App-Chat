import { CommonActions } from "@react-navigation/native";
import axios, { AxiosError, isAxiosError } from "axios";
import { navigationRef } from "./navigationRef";
import { clearDataStorage, getDataStorage } from "./localStorage";
// import { store } from "../state/redux";

export const baseURL = "http://192.168.1.39:4000/api/"; // development
// export const baseURL = "https://api-chat-mobile-adhri14s-projects.vercel.app/api/"; // production
export const imageURL = "http://www.apimobilechat.appsku.cloud/uploads";
// export const imageURL = "https://api-chat-mobile-adhri14s-projects.vercel.app/public/uploads";
const statusCodeDanger = [401];

export const requestHttp = axios.create({
    baseURL,
});

export const redirect = async () => {
    // clear session token
    clearDataStorage(['token_user']);

    // handle multiple redirect
    const safeNavigation =
        navigationRef.current &&
        typeof navigationRef.current.getRootState === "function";
    if (safeNavigation) {
        const navRoutes = await navigationRef?.current?.getRootState();
        if (
            Array.isArray(navRoutes?.routes) &&
            typeof navRoutes.index === "number" &&
            typeof navRoutes.routes[navRoutes.index] !== "undefined" &&
            navRoutes.routes[navRoutes.index].name === "Home"
        ) {
            return;
        }
    }

    // redirect
    await navigationRef?.current?.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: "SignIn" }],
        })
    );
};

const errorResponse = (data: any, messageCode: number) => {
    return {
        status: typeof data.status !== "undefined" ? data.status : messageCode,
        message:
            typeof data.message !== "undefined"
                ? data.message
                : "Tidak terhubung ke server",
        data: data,
    };
};

export const postAPI = async (endtpoint: string, body: any, paramConfig?: any) => {
    const auth = await getDataStorage('token_user');

    const config = {
        headers: {
            Authorization: "Bearer " + auth.token,
            ...paramConfig,
        },
    };

    try {
        const result = await requestHttp.post(endtpoint, body, config);

        if (result.status === 200 || result.status === 201) {
            return result.data;
        }

        throw {
            status: result.status,
            message: "Terjadi kesalahan",
            data: result,
        };
    } catch (error: any) {
        if (statusCodeDanger.includes(error.response.status)) {
            redirect();
        }
        throw errorResponse(error?.response?.data, error?.status!);
    }
};

export const postAPIBasic = async (endtpoint: string, body: any, paramConfig?: any) => {
    const config = {
        ...paramConfig,
    };

    try {
        const result = await requestHttp.post(endtpoint, body, config);

        if (result.status === 200 || result.status === 201) {
            return result.data;
        }

        throw {
            status: result.status,
            message: "Terjadi kesalahan",
            data: result,
        };
    } catch (error: any) {
        throw errorResponse(error?.response?.data, error?.status!);
    }
};

export const getAPI = async (endtpoint: string, paramConfig?: any) => {
    const auth = await getDataStorage('token_user');

    const config = {
        ...paramConfig,
        headers: {
            Authorization: "Bearer " + auth?.token,
        },
    };

    try {
        const result = await requestHttp.get(endtpoint, config);

        if (result.status === 200) {
            return result.data;
        }

        throw {
            status: result.status,
            message: "Terjadi kesalahan",
            data: result,
        };
    } catch (error: any) {
        if (statusCodeDanger.includes(error.response.status)) {
            console.log(statusCodeDanger.includes(error.response.status));
            redirect();
        }
        throw errorResponse(error?.response?.data, error?.status!);
    }
};