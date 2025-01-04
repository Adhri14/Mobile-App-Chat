import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity, Pressable } from "react-native";
import { colors, fonts } from "../../assets/theme";
import HighlightText from "../HiglightText";
import { MetaDataType } from "../../recoil/state";
import { ResultFileTypes } from "../../pages/ChatRoom";
import { Gesture, GestureDetector, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

type ListChatTypes = {
    isMe?: boolean;
    message?: string;
    time?: string;
    statusRead?: boolean;
    meta?: MetaDataType;
    media?: ResultFileTypes;
    onPreviewImage?: () => void;
    onLoadEndImage?: () => void;
    onLongPress?: () => void;
    onReply?: () => void;
    replyMessage?: any;
    userIdLogin?: string;
    profile?: any;
    onGoTo?: () => void;
}

const ListChat = ({ isMe, message, time, statusRead, meta, media, onPreviewImage, onLoadEndImage, onLongPress, onReply, replyMessage, userIdLogin, profile, onGoTo }: ListChatTypes) => {
    const translateX = useSharedValue(0);
    console.log('replyMessage', replyMessage);

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
                console.log('masuk sini nggk?')
                translateX.value = Math.max(0, event.translationX * 0.5);
            }
        })
        .onEnd(() => {
            if (translateX.value > 55) {
                // onReply && onReply(); // Trigger reply action if threshold is met
                runOnJS(onReply!)(); // Call the JS function safely
            }
            translateX.value = withTiming(0); // Reset position
        })

    // const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    //     onActive: (event) => {
    //         translateX.value = Math.max(0, event.translationX * 0.5);
    //     },
    //     onEnd: (event) => {
    //         if (translateX.value > 55) {
    //             runOnJS(onReply!)();
    //         }
    //         translateX.value = withTiming(0);
    //     }
    // });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));
    const regex = /https?:\/\/[^\s]+/g; // Regex untuk URL

    const onOpenURL = useCallback(async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            await Linking.openURL(url);
        }
    }, []);

    // Styles for the icon
    const animatedIconStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, 50], [0, 1]),
        transform: [{ scale: interpolate(translateX.value * 0.2, [0, 50], [0.9, 1]) }],
    }));

    if (isMe) {
        return (
            // <GestureDetector gesture={panGesture}>
            <Pressable onLongPress={onLongPress}>
                <Animated.View style={[animatedIconStyle, { backgroundColor: colors.primarySoft, width: 30, height: 30, borderRadius: 25, position: 'absolute', top: 15, left: 0, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }]}>
                    <MaterialIcons size={24} color={colors.primary} name="reply" />
                </Animated.View>
                <GestureDetector gesture={panGesture}>
                    {/* <PanGestureHandler onGestureEvent={panGesture}> */}
                    <Animated.View style={[styles.containerIsMe, animatedStyle]}>
                        {/* <Text style={styles.message}>{message}</Text> */}
                        {replyMessage && (
                            <Pressable onPress={onGoTo} style={[styles.containerReply, { borderLeftWidth: 5, borderLeftColor: replyMessage?.sender?._id === userIdLogin ? colors.primary : colors.danger, backgroundColor: colors.primaryLight }]}>
                                <View style={{ flex: 1, padding: 10 }}>
                                    <Text style={[styles.titleReply, { fontSize: 12, color: replyMessage?.sender?._id === userIdLogin ? colors.primary : colors.danger }]} numberOfLines={1}>{replyMessage?.sender?._id === userIdLogin ? 'Kamu' : replyMessage?.sender?.fullName}</Text>
                                    <Text style={[styles.descReply]} numberOfLines={1}>{replyMessage?.message ? replyMessage?.message : 'Foto'}</Text>
                                </View>
                            </Pressable>
                        )}
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
                            <Image source={{ uri: media?.url }} style={{ width: media?.width, maxWidth: '100%', height: media?.height * 0.3, maxHeight: 350, borderRadius: 10 }} resizeMode={media?.height > 350 ? "cover" : "contain"} onLoadEnd={onLoadEndImage} />
                        </Pressable>}
                        {message && <View style={{ marginTop: media ? 10 : 0 }}>
                            <HighlightText text={message} /></View>}
                        <View style={styles.lastSeen}>
                            <Text style={styles.time}>{time}</Text>
                            <Image source={statusRead ? require('../../assets/images/icon-check-double.png') : require('../../assets/images/icon-check.png')} style={styles.iconLastSeen} />
                        </View>
                    </Animated.View>
                    {/* </PanGestureHandler> */}
                </GestureDetector>
            </Pressable>
            // </GestureDetector>
        );
    }
    return (
        <Pressable onLongPress={onLongPress}>
            <Animated.View style={[animatedIconStyle, { backgroundColor: colors.primarySoft, width: 30, height: 30, borderRadius: 25, position: 'absolute', top: 15, left: 0, justifyContent: 'center', alignItems: 'center' }]}>
                <MaterialIcons size={24} color={colors.primary} name="reply" />
            </Animated.View>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.containerOther, animatedStyle]}>
                    {replyMessage && (
                        <Pressable onPress={onGoTo} style={[styles.containerReply, { borderLeftWidth: 5, borderLeftColor: replyMessage?.sender?._id === userIdLogin ? colors.primary : colors.danger, backgroundColor: colors.grayLight }]}>
                            <View style={{ flex: 1, padding: 10 }}>
                                <Text style={[styles.titleReply, { fontSize: 12, color: replyMessage?.sender?._id === userIdLogin ? colors.primary : colors.danger }]} numberOfLines={1}>{replyMessage?.sender?._id === userIdLogin ? 'Kamu' : replyMessage?.sender?.fullName}</Text>
                                <Text style={[styles.descReply]} numberOfLines={1}>{replyMessage?.message ? replyMessage?.message : 'Foto'}</Text>
                            </View>
                        </Pressable>
                    )}
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
                        <Image source={{ uri: media?.url }} style={{ width: media?.width, maxWidth: '100%', height: media?.height * 0.3, borderRadius: 10, maxHeight: 350 }} resizeMode={media?.height > 350 || media?.width > 100 ? "cover" : "contain"} onLoadEnd={onLoadEndImage} />
                    </Pressable>}
                    {/* <Text style={styles.message}>{message}</Text> */}
                    {message && <View style={{ marginTop: media ? 10 : 0 }}>
                        <HighlightText text={message} /></View>}
                    <View style={styles.lastSeen}>
                        <Text style={styles.time}>{time}</Text>
                        {/* <Image source={statusRead ? require('../../assets/images/icon-check-double.png') : require('../../assets/images/icon-check.png')} style={styles.iconLastSeen} /> */}
                    </View>
                </Animated.View>
            </GestureDetector>
        </Pressable>
    );
}

export default ListChat;

const styles = StyleSheet.create({
    containerOther: {
        backgroundColor: colors.gray,
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        padding: 10,
        maxWidth: '80%',
        alignSelf: 'flex-start',
        marginBottom: 10,
        overflow: 'hidden',
    },
    containerIsMe: {
        backgroundColor: colors.primarySoft,
        borderRadius: 20,
        borderBottomRightRadius: 0,
        padding: 10,
        maxWidth: '80%',
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
    },
    containerReply: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
    },
    titleReply: {
        fontSize: 16,
        fontFamily: fonts.bold,
        color: colors.black,
        marginBottom: 2,
    },
    descReply: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.black,
    },
});