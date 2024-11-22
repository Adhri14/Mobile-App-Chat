import { atom } from "recoil";

export type MetaType = {
    data?: MetaDataType;
    status: boolean,
    isLoading?: boolean;
}

export type MetaDataType = {
    title: string;
    description: string;
    image: string;
    url: string;
}

const metaDataState = atom<MetaType>({
    key: 'MetaData',
    default: {
        data: {
            title: '',
            description: '',
            image: '',
            url: '',
        },
        status: false,
        isLoading: false,
    },
});

export {
    metaDataState
};