import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, Text, StyleSheet, Platform, Animated, TextInputProps } from "react-native";
import { colors, fonts } from "../../assets/theme";

interface InputTextType extends TextInputProps {
    label: string;
    value: any;
    onChangeText: (text: string) => void;
    inputPassword?: boolean;
    textArea?: boolean;
    message?: string;
}

const InputText = (props: InputTextType) => {
    const { value, onChangeText, label, inputPassword = false, textArea = false, message } = props;
    const [isActive, setIsActive] = useState(false);
    const textTransform = useRef(new Animated.Value(0)).current;
    const scaleText = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (value) {
            Animated.timing(textTransform, {
                toValue: -28,
                duration: 200,
                useNativeDriver: true,
            }).start();
            Animated.timing(scaleText, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true,
            }).start();
            setIsActive(true);
        }
    }, [value])

    const onFocus = () => {
        Animated.timing(textTransform, {
            toValue: -28,
            duration: 200,
            useNativeDriver: true,
        }).start();
        Animated.timing(scaleText, {
            toValue: 0.8,
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
            Animated.timing(scaleText, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
            setIsActive(false);
        }
    }

    return (
        <>
            <View style={[styles.container, { height: textArea ? 100 : 60, marginBottom: !message ? 20 : 0 }]}>
                <Animated.Text style={[styles.label, { transform: [{ translateY: textTransform }, { scale: scaleText }], backgroundColor: isActive ? colors.gray : 'transparent', paddingHorizontal: 10 }]}>{label}</Animated.Text>
                {textArea ? (
                    <TextInput
                        style={[styles.input, { verticalAlign: 'top' }]}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        selectionColor={colors.primarySoft}
                        multiline
                        {...props}
                    />
                ) : <TextInput
                    style={styles.input}
                    // value={value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    // onChangeText={onChangeText}
                    secureTextEntry={inputPassword}
                    selectionColor={colors.primarySoft}
                    {...props}
                />}
            </View >
            {message && <Text style={styles.error}>{message}</Text>}
        </>
    );
}

export default InputText;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray,
        borderRadius: 14,
        paddingHorizontal: 20,
        position: 'relative',
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
    },
    error: { fontSize: 12, fontFamily: fonts.medium, color: colors.danger, marginBottom: 20, marginTop: 5 }
});