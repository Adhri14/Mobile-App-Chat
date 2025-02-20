import React from "react";
import { View, Text, StyleSheet, Image, Pressable, ImageURISource } from "react-native";
import { colors, fonts } from "../../assets/theme";

type HeaderTypes = {
    onPress?: () => void;
    isBack?: boolean;
    iconRight?: boolean;
    onPressNewChat?: () => void;
    onPressAvatar?: () => void;
    fontSizeTitle?: number;
    color?: string;
    titleHeader?: string;
    avatar?: ImageURISource;
}

const Header = (props: HeaderTypes) => {
    const { onPress, isBack = true, iconRight, onPressAvatar, onPressNewChat, fontSizeTitle = 24, color = colors.primary, titleHeader, avatar = { uri: 'https://i.pravatar.cc/300' } } = props;
    return (
        <View style={styles.container}>
            <View style={styles.buttonLeft}>
                {isBack && (
                    <Pressable style={styles.button} onPress={onPress}>
                        <Image source={require('../../assets/images/icon-back.png')} style={styles.image} />
                    </Pressable>
                )}
                <Text style={[styles.title, { fontSize: fontSizeTitle, color }]}>{titleHeader || 'Econify'}</Text>
            </View>
            {iconRight && (
                <View style={styles.buttonRight}>
                    <Pressable style={styles.icon} onPress={onPressNewChat}>
                        <Image source={require('../../assets/images/icon-add-chat.png')} style={styles.addChat} />
                    </Pressable>
                    <Pressable style={styles.icon} onPress={onPressAvatar}>
                        <Image source={avatar} style={styles.avatar} />
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
        width: 34,
        height: 34,
        justifyContent: 'center',
    },
    image: {
        width: 24,
        height: 24
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
    buttonLeft: {
        flexDirection: 'row',
        alignItems: 'center',
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