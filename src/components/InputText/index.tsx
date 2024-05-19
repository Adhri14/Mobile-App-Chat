import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, Text, StyleSheet, Platform, Animated, TextInputProps } from "react-native";
import { colors, fonts } from "../../assets/theme";

interface InputTextType extends TextInputProps {
    label: string;
    value: any;
    onChangeText: (text: string) => void;
    inputPassword?: boolean;
}

const InputText = ({ value, onChangeText, label, inputPassword = false }: InputTextType) => {
    const [isActive, setIsActive] = useState(false);
    const textTransform = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (value) {
            Animated.timing(textTransform, {
                toValue: -30,
                duration: 200,
                useNativeDriver: true,
            }).start();
            setIsActive(true);
        }
    }, [value])

    const onFocus = () => {
        Animated.timing(textTransform, {
            toValue: -30,
            duration: 200,
            useNativeDriver: true,
        }).start();
        setIsActive(true);
    }

    const onBlur = () => {
        if (!value) {
            Animated.timing(textTransform, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
            setIsActive(false);
        }
    }

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.label, { transform: [{ translateY: textTransform }, { scale: isActive ? .8 : 1 }], backgroundColor: isActive ? colors.gray : 'transparent' }]}>{label}</Animated.Text>
            <TextInput
                style={styles.input}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChangeText}
                secureTextEntry={inputPassword}
                selectionColor={colors.primarySoft}
            />
        </View >
    );
}

export default InputText;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray,
        height: 60,
        borderRadius: 14,
        paddingHorizontal: 20,
        position: 'relative',
        marginBottom: 20
    },
    label: {
        position: 'absolute',
        left: 20,
        top: 18,
        fontSize: 16,
        fontFamily: fonts.normal,
        color: colors.dark2
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: fonts.normal,
        color: colors.dark2
    }
});