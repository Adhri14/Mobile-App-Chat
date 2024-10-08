import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, TextInput, Image, StyleSheet, Keyboard, Platform } from "react-native";
import { colors, fonts } from "../../assets/theme";

type InputChatTypes = {
    value?: string | number | any;
    onChangeText?: (value: string) => void;
    onSend?: () => void;
}

const InputChat = (props: InputChatTypes) => {
    const { value, onChangeText, onSend } = props;
    const [showTabbar, setShowTabbar] = useState(true);

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