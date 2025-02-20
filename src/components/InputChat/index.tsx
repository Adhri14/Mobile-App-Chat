import React, { forwardRef, useEffect, useState } from "react";
import { View, TouchableOpacity, TextInput, Image, StyleSheet, Keyboard, Platform, ViewStyle, StyleProp, TextInputProps } from "react-native";
import { colors, fonts } from "../../assets/theme";
import { Parts } from "../HiglightText";
import axios from "axios";
import cio from "cheerio-without-node-native";
import { errorResponse } from "../../utils/httpService";
import { useSetRecoilState } from "recoil";
import { metaDataState, MetaDataType } from "../../recoil/state";
import Ionicons from "react-native-vector-icons/Ionicons";

type InputChatTypes = TextInputProps & {
    value?: string | number | any;
    onChangeText?: (value: string) => void;
    onSend?: () => void;
    onAddComponent?: () => void;
    component?: boolean;
    disabled?: boolean;
    styleContainer?: StyleProp<ViewStyle>;
}

const initValue = {
    title: '',
    description: '',
    image: '',
    url: '',
};

const InputChat = forwardRef<TextInput, InputChatTypes>((props, ref) => {
    const { value, onChangeText, onSend, disabled, onAddComponent, component = false, styleContainer } = props;
    const setMetaData = useSetRecoilState(metaDataState);

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

    const splitTextByRegex = (text: string, regex: RegExp) => {
        const newParts: Parts[] = [];
        let lastIndex = 0;

        text.replace(regex, (match, index) => {
            if (Number(index) > lastIndex) {
                newParts.push({ text: text.slice(lastIndex, Number(index)), isMatch: false });
            }
            newParts.push({ text: String(match), isMatch: true });
            lastIndex = Number(index) + Number(match?.length);
            return "";
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
        <View style={[styles.container, styleContainer]}>
            {component && <TouchableOpacity onPress={onAddComponent} style={[styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary, marginRight: 10 }]}>
                <Ionicons name="add" color={colors.primary} size={24} />
            </TouchableOpacity>}
            <TextInput ref={ref} {...props} multiline value={value} onChangeText={onChangeText} autoCorrect={false} style={styles.input} placeholder={Platform.OS === 'android' ? 'Type your message' : undefined} placeholderTextColor={colors.black} />
            <TouchableOpacity style={styles.button} onPress={onSend} disabled={disabled}>
                <Image source={require('../../assets/images/icon-send.png')} style={styles.image} />
            </TouchableOpacity>
        </View>
    );
});

export default InputChat;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 24,
    },
    button: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        transform: [
            {
                rotate: '45deg'
            }
        ]
    },
    input: {
        flex: 1,
        backgroundColor: colors.gray,
        paddingHorizontal: 10,
        marginRight: 10,
        borderRadius: 10,
        fontSize: 14,
        fontFamily: fonts.normal,
        color: colors.black,
        minHeight: 30,
        maxHeight: 80,
    }
});