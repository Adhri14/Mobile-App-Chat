import React from "react";
import { View, TouchableOpacity, TextInput, Image, StyleSheet } from "react-native";
import { colors, fonts } from "../../assets/theme";

type InputChatTypes = {
    value?: string | number | any;
    onChangeText?: (value: string) => void;
    onSend?: () => void;
}

const InputChat = (props: InputChatTypes) => {
    const { value, onChangeText, onSend } = props;
    return (
        <View style={styles.container}>
            <TextInput multiline value={value} onChangeText={onChangeText} placeholder="Type your message" style={styles.input} placeholderTextColor={colors.black} />
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
        paddingVertical: 10
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
        maxHeight: 80
    }
});