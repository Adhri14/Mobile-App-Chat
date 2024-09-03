import React, { memo } from "react";
import { View, StyleSheet, TextInput, Image, TextInputProps, TextInputAndroidProps, TextInputIOSProps } from "react-native";
import { colors, fonts } from "../../assets/theme";

interface SearchInputType extends TextInputProps, TextInputAndroidProps, TextInputIOSProps { }

const SearchInput: React.FC<SearchInputType> = ({ ...props }) => {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/icon-search.png')} style={styles.icon} />
            <TextInput {...props} placeholder="Search" style={styles.input} placeholderTextColor={colors.dark} selectionColor={colors.primarySoft} />
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