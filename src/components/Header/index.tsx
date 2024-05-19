import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { colors, fonts } from "../../assets/theme";

type HeaderTypes = {
    onPress?: () => void;
    isBack?: boolean;
    iconRight?: boolean;
    onPressNewChat?: () => void;
    onPressAvatar?: () => void;
}

const Header = (props: HeaderTypes) => {
    const { onPress, isBack = true, iconRight, onPressAvatar, onPressNewChat } = props;
    return (
        <View style={styles.container}>
            {isBack && (
                <Pressable style={styles.button} onPress={onPress}>
                    <Image source={require('../../assets/images/icon-back.png')} style={styles.image} />
                </Pressable>
            )}
            <Text style={styles.title}>Econify</Text>
            {iconRight && (
                <View style={styles.buttonRight}>
                    <Pressable style={styles.icon} onPress={onPressNewChat}>
                        <Image source={require('../../assets/images/icon-add-chat.png')} style={styles.addChat} />
                    </Pressable>
                    <Pressable style={styles.icon} onPress={onPressAvatar}>
                        <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.avatar} />
                    </Pressable>
                </View>
            )}
            {/* <Text>Header</Text> */}
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        width: 50,
        height: 50,
        justifyContent: 'center',
    },
    image: {
        width: 30,
        height: 30
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.bold,
        color: colors.primary
    },
    buttonRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2
    },
    addChat: {
        width: 30,
        height: 30,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 35 / 2
    },
});