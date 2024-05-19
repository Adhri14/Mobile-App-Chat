import AsyncStorage from "@react-native-async-storage/async-storage"

export const getDataStorage = async (key?: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key!)
        return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
        throw e;
    }
}

export const setDataStorage = async (key?: string, value?: any) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key!, jsonValue)
    } catch (e) {
        throw e;
    }
}

export const clearDataStorage = async (keys: string[] = []) => {
    const _keys = [...keys];
    try {
        await AsyncStorage.multiRemove(_keys)
    } catch (e) {
        throw e;
    }
}