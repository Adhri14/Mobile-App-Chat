import { postAPIBasic } from "../utils/httpService"

export const signUpAPI = (data: any) => {
    return postAPIBasic('auth/sign-up', data);
}

export const singInAPI = (data: any) => {
    return postAPIBasic('auth/sign-in', data);
}

export const signInGoogleAPI = (data: any) => {
    return postAPIBasic('auth/sign-in/google', data);
}

export const verficationAPI = (data: any) => {
    return postAPIBasic('auth/verification', data);
}

export const resendOTPAPI = (data: any) => {
    return postAPIBasic('auth/send-otp', data);
}

export const forgotPasswordAPI = (data: any) => {
    return postAPIBasic('auth/forgot-password', data);
}