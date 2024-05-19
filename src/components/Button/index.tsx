import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { colors, fonts } from "../../assets/theme";

type ButtonTypes = {
    label: string;
    onPress: () => void;
}

const Button = ({ label, onPress }: ButtonTypes) => {
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
            <Pressable style={styles.button} onPress={onPressIn}>
                <Text style={styles.textButton}>{label}</Text>
            </Pressable>
            <View style={styles.blur} />
        </Animated.View>
    );
}

export default Button;

const styles = StyleSheet.create({
    button: {
        height: 60,
        borderRadius: 14,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
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