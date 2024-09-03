import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../../assets/theme";
import Ionicons from "react-native-vector-icons/Ionicons";

type CheckboxTypes = {
    value: boolean;
    onValueChange: () => void;
};

const Checkbox = ({ value, onValueChange }: CheckboxTypes) => {
    const fadeBox = useRef(new Animated.Value(0)).current;

    const onCheckbox = () => {
        Animated.timing(fadeBox, {
            toValue: !value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
        onValueChange();
    }

    return (
        <Pressable onPress={onCheckbox} style={styles.container}>
            <View style={[styles.checkbox, { backgroundColor: colors.gray }]}>
                <Animated.View style={[styles.checkbox, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.primary, opacity: fadeBox }]} />
                {value ? <Ionicons size={14} color={'white'} name="checkmark-sharp" /> : null}
            </View>
            <Text onPress={onCheckbox} style={styles.agree}>I’m agree to The <Text style={styles.bold}>Terms of Service</Text> and <Text style={styles.bold}>Privacy Policy</Text></Text>
        </Pressable>
    );
}

export default Checkbox;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCheck: {
        color: 'white',
        fontSize: 10,
    },
    agree: {
        fontSize: 12,
        fontFamily: fonts.normal,
        marginLeft: 10,
        color: colors.dark
    },
    bold: {
        color: colors.primary,
        fontFamily: fonts.bold
    }
});