import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { ListUserScreenTypes } from "../router";
import Tabs from "../components/Tabs";
import { tabs } from "./ListUser/tabs";
import Header from "../components/Header";
import { colors } from "../assets/theme";

export default function ListUser({ navigation, route }: ListUserScreenTypes) {
    const { initialRouteIndex, username, userId } = route.params;
    return (
        <View style={styles.page}>
            <Header titleHeader={username || 'Econify'} isBack onPress={() => navigation.goBack()} fontSizeTitle={16} color={colors.black} />
            <Tabs data={tabs} initialRouteIndex={initialRouteIndex as number} userId={userId} onChangeTab={(index) => console.log(index)} />
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    }
});