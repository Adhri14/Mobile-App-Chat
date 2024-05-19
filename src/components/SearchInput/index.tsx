import React from "react";
import { View, StyleSheet, TextInput, Image } from "react-native";
import { colors, fonts } from "../../assets/theme";

const SearchInput = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/icon-search.png')} style={styles.icon} />
            <TextInput placeholder="Search" style={styles.input} placeholderTextColor={colors.dark} selectionColor={colors.primarySoft} />
        </View>
    );
}

export default SearchInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.gray,
        alignItems: 'center',
        height: 46,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: fonts.normal,
        color: colors.black
    }
});