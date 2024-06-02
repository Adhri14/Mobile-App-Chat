import React from "react";
import { View, Text, StyleSheet, Pressable, Image, ImageURISource } from "react-native";
import { colors, fonts } from "../../assets/theme";

type ListMessageTypes = {
    name: string;
    message?: string;
    time?: string;
    isNewMessage?: boolean;
    countNewMessage?: number;
    onPress?: () => void;
    image?: ImageURISource;
}

const ListMessage = (props: ListMessageTypes) => {
    const { name, message, time, isNewMessage = false, countNewMessage, onPress, image = { uri: 'https://i.pravatar.cc/300' } } = props;
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image source={image} style={styles.avatar} />
            <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                {message && <Text style={[styles.message, { fontFamily: isNewMessage ? fonts.bold : fonts.normal }]} numberOfLines={1}>{message}</Text>}
            </View>
            {time && (
                <View style={{ marginLeft: 10, justifyContent: 'space-between' }}>
                    <Text style={styles.time}>{time}</Text>
                    {isNewMessage ? (
                        <View style={styles.newMessage}>
                            <Text style={styles.textNewMessage}>{countNewMessage}</Text>
                        </View>
                    ) : <View style={[styles.newMessage, { backgroundColor: 'transparent' }]} />}
                </View>
            )}
        </Pressable>
    );
}

export default ListMessage;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 15,
        resizeMode: 'cover',
        marginRight: 16
    },
    name: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: colors.black
    },
    message: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.dark2
    },
    time: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.dark2,
        textAlign: 'right',
        marginBottom: 5
    },
    newMessage: {
        width: 20,
        height: 20,
        backgroundColor: colors.primarySoft,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end'
    },
    textNewMessage: {
        fontSize: 12,
        fontFamily: fonts.medium,
        color: colors.primaryBold,
        lineHeight: 16
    },
});