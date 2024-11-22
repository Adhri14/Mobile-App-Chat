import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, TextInput, Image, StyleSheet, Keyboard, Platform } from "react-native";
import { colors, fonts } from "../../assets/theme";
import { Parts } from "../HiglightText";
import axios from "axios";
import cio from "cheerio-without-node-native";
import { errorResponse } from "../../utils/httpService";
import { useSetRecoilState } from "recoil";
import { metaDataState, MetaDataType } from "../../recoil/state";

type InputChatTypes = {
    value?: string | number | any;
    onChangeText?: (value: string) => void;
    onSend?: () => void;
}

const initValue = {
    title: '',
    description: '',
    image: '',
    url: '',
};

const InputChat = (props: InputChatTypes) => {
    const { value, onChangeText, onSend } = props;
    const [showTabbar, setShowTabbar] = useState(true);
    const setMetaData = useSetRecoilState(metaDataState);

    useEffect(() => {
        const subscribeShow = Keyboard.addListener('keyboardDidShow', (event) => {
            setShowTabbar(false);
        });
        const subscribeHide = Keyboard.addListener('keyboardDidHide', (event) => {
            setShowTabbar(true);
        });
        return () => {
            subscribeShow.remove();
            subscribeHide.remove();
        }
    }, [showTabbar]);

    useEffect(() => {
        let timeout;
        timeout = value ? setTimeout(getDataMeta, 500) : setMetaData({
            data: {
                title: '',
                description: '',
                image: '',
                url: '',
            },
            status: false,
        });

        return () => {
            clearTimeout(timeout!);
        }
    }, [value]);

    const getDataMeta = async () => {
        const regex = /https?:\/\/[^\s]+/g; // Regex untuk URL
        const parts: Parts[] = splitTextByRegex(value!, regex);

        try {
            for (let item of parts) {
                if (item.isMatch) {
                    setMetaData({
                        isLoading: true,
                        status: true,
                    });
                    const resMeta = await getMetaData(item.text);
                    console.log('cek : ', resMeta.data);
                    setMetaData({
                        status: resMeta.status === 200,
                        isLoading: false,
                        data: { ...resMeta.data }
                    });
                } else {
                    setMetaData({
                        data: initValue,
                        status: false,
                        isLoading: false,
                    });
                }
            }
        } catch (error) {
            setMetaData({
                data: initValue,
                status: false,
                isLoading: false,
            });
        }

    }

    const splitTextByRegex = (text: string, regex: any) => {
        const newParts: Parts[] = [];
        let lastIndex = 0;

        text.replace(regex, (match?: string, index?: number) => {
            if (Number(index) > lastIndex) {
                newParts.push({ text: text.slice(lastIndex, Number(index)), isMatch: false });
            }
            newParts.push({ text: String(match), isMatch: true });
            lastIndex = Number(index) + Number(match?.length);
        });

        if (lastIndex < text.length) {
            newParts.push({ text: text.slice(lastIndex), isMatch: false });
        }

        return newParts;
    };

    const getMetaData = async (url: string) => {
        try {
            const response = await axios.get(url);
            const $ = cio.load(response.data);

            const metaData: MetaDataType = {
                title: $('meta[property="og:title"]').attr('content') || $('title').text(),
                description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
                image: $('meta[property="og:image"]').attr('content'),
                url: $('meta[property="og:url"]').attr('content') || url,
            };

            return {
                status: 200,
                data: { ...metaData }
            };
        } catch (error: any) {
            console.log('error : ', error.response);
            throw errorResponse;
        }
    }

    return (
        <View style={[styles.container, { marginBottom: Platform.OS === 'ios' && !showTabbar ? 70 : Platform.OS === 'android' ? 20 : 0 }]}>
            <TextInput multiline value={value} onChangeText={onChangeText} autoCorrect={false} placeholder="Type your message" style={styles.input} placeholderTextColor={colors.black} />
            <TouchableOpacity style={styles.button} onPress={onSend}>
                <Image source={require('../../assets/images/icon-send.png')} style={styles.image} />
            </TouchableOpacity>
        </View>
    );
}

export default InputChat;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 24,
    },
    button: {
        width: 45,
        height: 45,
        borderRadius: 15,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
        marginTop: -5,
        marginLeft: 5
    },
    input: {
        flex: 1,
        backgroundColor: colors.gray,
        paddingHorizontal: 10,
        marginRight: 20,
        borderRadius: 10,
        fontSize: 14,
        fontFamily: fonts.normal,
        minHeight: 45,
        maxHeight: 80,
    }
});