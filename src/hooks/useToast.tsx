import React, { useEffect, useState } from 'react'
import { showMessage } from 'react-native-flash-message';
import { colors, fonts } from '../assets/theme';

type ToastType = {
    isShow?: boolean;
    isError?: boolean;
    title?: string;
    message?: string;
}

const useToast = () => {
    const [toast, setToastFun] = useState<ToastType>({
        isShow: false,
        isError: false,
        title: 'Econify Title',
        message: 'Econify message!',
    });

    useEffect(() => {
        if (toast.isShow) {
            showMessage({
                message: String(toast.title),
                description: String(toast.message),
                type: toast.isError ? 'danger' : 'success',
                titleStyle: {
                    fontSize: 12,
                    fontFamily: fonts.bold,
                    color: 'white',
                },
                textStyle: {
                    fontSize: 14,
                    fontFamily: fonts.normal,
                    color: 'white',
                },
                backgroundColor: toast.isError ? colors.danger : colors.primaryBold
            });
            setToastFun({
                ...toast,
                isShow: false,
            });
        }
    }, [toast.isShow]);

    const setToast = (params: ToastType) => {
        const { isShow, isError, title, message } = params;
        setToastFun({
            ...toast,
            isShow,
            isError,
            title,
            message
        });
    }

    return { setToast };
}

export default useToast;