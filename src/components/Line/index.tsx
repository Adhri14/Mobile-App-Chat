import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../../assets/theme";

export default function Line() {
    return (
        <View style={styles.line}>
            <View style={styles.divider} />
            <Text style={[styles.link]}>OR</Text>
            <View style={styles.divider} />
        </View>
    );
}

const styles = StyleSheet.create({
    link: {
        fontSize: 14,
        fontFamily: fonts.normal,
        color: colors.dark,
        paddingHorizontal: 10
    },
    line: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    divider: {
        height: 1,
        width: '42%',
        backgroundColor: colors.dark
    }
});