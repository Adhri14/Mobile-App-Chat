import React, { useCallback } from "react";
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity, Pressable } from "react-native";
import { colors, fonts } from "../../assets/theme";
import HighlightText from "../HiglightText";
import { MetaDataType } from "../../recoil/state";
import { ResultFileTypes } from "../../pages/ChatRoom";

type ListChatTypes = {
    isMe?: boolean;
    message?: string;
    time?: string;
    statusRead?: boolean;
    meta?: MetaDataType;
    media?: ResultFileTypes;
    onPreviewImage?: () => void;
    onLoadEndImage?: () => void;
}

const ListChat = ({ isMe, message, time, statusRead, meta, media, onPreviewImage, onLoadEndImage }: ListChatTypes) => {
    const regex = /https?:\/\/[^\s]+/g; // Regex untuk URL

    const onOpenURL = useCallback(async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            await Linking.openURL(url);
        }
    }, []);

    if (isMe) {
        return (
            <View style={styles.containerIsMe}>
                {/* <Text style={styles.message}>{message}</Text> */}
                {meta ? (
                    <TouchableOpacity onPress={() => onOpenURL(meta.url)} style={{ marginBottom: 5 }} activeOpacity={0.7}>
                        {regex.test(meta.image) ? <Image source={{ uri: meta.image }} style={{ width: '100%', height: 160, maxHeight: 280, resizeMode: 'contain' }} /> : null}
                        <View style={{ paddingVertical: 10 }}>
                            <Text style={styles.metaTitle}>{meta.title}</Text>
                            <Text style={styles.metaUrl}>{meta.url}</Text>
                            <Text style={styles.metaDesc} numberOfLines={3}>{meta.description}</Text>
                        </View>
                    </TouchableOpacity>
                ) : null}
                {media && <Pressable onPress={onPreviewImage}>
                    <Image source={{ uri: media?.url }} style={{ minWidth: media?.width * 0.37, maxWidth: '90%', height: media?.height * 0.37, borderRadius: 10 }} resizeMode="contain" onLoadEnd={onLoadEndImage} />
                </Pressable>}
                {message && <View style={{ marginTop: media ? 10 : 0 }}>
                    <HighlightText text={message} /></View>}
                <View style={styles.lastSeen}>
                    <Text style={styles.time}>{time}</Text>
                    <Image source={statusRead ? require('../../assets/images/icon-check-double.png') : require('../../assets/images/icon-check.png')} style={styles.iconLastSeen} />
                </View>
            </View>
        );
    }
    return (
        <View style={styles.containerOther}>
            {meta ? (
                <TouchableOpacity onPress={() => onOpenURL(meta.url)} style={{ marginBottom: 5 }} activeOpacity={0.7}>
                    {regex.test(meta.image) ? <Image source={{ uri: meta.image }} style={{ width: media?.width, height: 160, maxHeight: 280, resizeMode: 'contain' }} /> : null}
                    <View style={{ paddingVertical: 10 }}>
                        <Text style={styles.metaTitle}>{meta.title}</Text>
                        <Text style={styles.metaUrl}>{meta.url}</Text>
                        <Text style={styles.metaDesc} numberOfLines={3}>{meta.description}</Text>
                    </View>
                </TouchableOpacity>
            ) : null}
            {media && <Pressable onPress={onPreviewImage}>
                <Image source={{ uri: media?.url }} style={{ minWidth: media?.width * 0.3, maxWidth: '90%', height: media?.height * 0.3, borderRadius: 10 }} resizeMode="contain" onLoadEnd={onLoadEndImage} />
            </Pressable>}
            {/* <Text style={styles.message}>{message}</Text> */}
            {message && <View style={{ marginTop: media ? 10 : 0 }}>
                <HighlightText text={message} /></View>}
            <View style={styles.lastSeen}>
                <Text style={styles.time}>{time}</Text>
                {/* <Image source={statusRead ? require('../../assets/images/icon-check-double.png') : require('../../assets/images/icon-check.png')} style={styles.iconLastSeen} /> */}
            </View>
        </View>
    );
}

export default ListChat;

const styles = StyleSheet.create({
    containerOther: {
        backgroundColor: colors.gray,
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        padding: 10,
        maxWidth: '90%',
        alignSelf: 'flex-start',
        marginBottom: 10,
        overflow: 'hidden',
    },
    containerIsMe: {
        backgroundColor: colors.primarySoft,
        borderRadius: 20,
        borderBottomRightRadius: 0,
        padding: 10,
        maxWidth: '90%',
        alignSelf: 'flex-end',
        marginBottom: 10,
        overflow: 'hidden'
    },
    message: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.black
    },
    time: {
        color: colors.black,
        fontSize: 10,
        fontFamily: fonts.normal,
        marginTop: 5,
        textAlign: 'right',
    },
    metaTitle: {
        color: colors.black,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
    metaDesc: {
        color: colors.black,
        fontSize: 12,
        fontFamily: fonts.normal,
        marginTop: 5
    },
    metaUrl: {
        color: colors.black,
        fontSize: 8,
        fontFamily: fonts.normal,
    },
    lastSeen: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    iconLastSeen: {
        width: 20,
        height: 20,
        marginTop: 2,
        marginLeft: 2
    }
});