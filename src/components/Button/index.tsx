import React, { ReactNode, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated, ViewStyle, PressableProps, StyleProp, ActivityIndicator, TextStyle } from "react-native";
import { colors, fonts } from "../../assets/theme";

interface ButtonTypes extends PressableProps {
    label: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    isLoading?: boolean;
    icon?: ReactNode;
}

const Button = (props: ButtonTypes) => {
    const { label, onPress, style, isLoading, icon, textStyle } = props;
    const scaleButton = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.timing(scaleButton, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: false,
        }).start();
        setTimeout(() => {
            Animated.timing(scaleButton, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }, 250);
        onPress();
    }

    return (
        <Animated.View style={{ transform: [{ scale: scaleButton }] }}>
            <Pressable {...props} style={[styles.button, style]} onPress={onPressIn}>
                {isLoading && <ActivityIndicator color='white' size="small" style={{ marginRight: 10 }} />}
                {icon ? icon : null}
                <Text style={[styles.textButton, textStyle]}>{isLoading ? 'Loading...' : label}</Text>
            </Pressable>
            <View style={styles.blur} />
        </Animated.View>
    );
}

export default Button;

const styles = StyleSheet.create({
    button: {
        height: 55,
        borderRadius: 14,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    textButton: {
        fontSize: 16,
        fontFamily: fonts.bold,
        color: 'white',
    },
    blur: {
        height: 10,
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        backgroundColor: "transparent",
        zIndex: -1,
        borderRadius: 10,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    }
});