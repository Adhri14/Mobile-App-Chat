import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Header from "../components/Header";
import { SettingScreenTypes } from "../router";
import { colors } from "../assets/theme";
import Button from "../components/Button";
import { clearDataStorage } from "../utils/localStorage";

const Setting = ({ navigation }: SettingScreenTypes) => {

    const onSignOut = () => {
        clearDataStorage(['token_user']);
        navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
    }

    return (
        <View style={styles.page}>
            <Header isBack titleHeader="Akun" color={colors.black} fontSizeTitle={16} onPress={() => navigation.goBack()} />
            <View style={styles.container}>
                <Button label="Keluar" onPress={onSignOut} />
            </View>
        </View>
    );
}

export default Setting;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24
    }
});