import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import Pusher from 'pusher-js/react-native';
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, FlatList, Image, ImageBackground, KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getListMessageAPI, sendMessageAPI, updateStatusReadAPI } from "../api/chat";
import { getProfile } from "../api/user";
import { colors, fonts } from "../assets/theme";
import Header from "../components/Header";
import InputChat from "../components/InputChat";
import ListChat from "../components/ListChat";
import useForceUpdate from "../hooks/useForceUpdate";
import { metaDataState, MetaDataType } from "../recoil/state";
import { ChatRoomScreenTypes } from "../router";
import Ionicons from "react-native-vector-icons/Ionicons";
import PreviewMetaChat from "../components/PreviewMetaChat";

const WrapperImage = ({ children }: { children: ReactNode }) => {
    return Platform.OS == 'ios' ? <View style={styles.container}>{children}</View> : <ImageBackground source={require('../assets/images/wallpaper.webp')} resizeMode="cover" style={styles.container}>{children}</ImageBackground>;
}

const KEY_CHAT = "conversation-chats-";

const initValue = {
    title: '',
    description: '',
    image: '',
    url: '',
};

const ChatRoom = ({ navigation, route }: ChatRoomScreenTypes) => {
    let { profile, chatId }: any = route.params;
    const { forceUpdate } = useForceUpdate();
    const isFocused = useIsFocused();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any>([]);
    const [userIdLogin, setUserIdLogin] = useState('');
    const [newChatId, setNewChatId] = useState('');
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [isPaginate, setIsPaginate] = useState(false);
    const [metaTagging, setMetaTagging] = useState<MetaDataType>(initValue);
    const [isShowMeta, setIsShowMeta] = useState(false);
    const metaDataValue = useRecoilValue(metaDataState);
    const setMetaData = useSetRecoilState(metaDataState);
    const fadeAnimation = useRef(new Animated.Value(0)).current;
    // const [showTabbar, setShowTabbar] = useState(true);

    useEffect(() => {
        if (isFocused) {
            if (chatId) {
                updateStatusRead();
            }
            getMessages();
            getProfile().then(res => {
                setUserIdLogin(res.data._id);
            }).catch(err => {
                console.log(err);
            });
        }
    }, [isFocused]);

    useEffect(() => {
        if (metaDataValue?.status) {
            setMetaTagging(metaDataValue?.data!);
            setIsShowMeta(true);
        } else {
            setMetaTagging(initValue);
            setIsShowMeta(false);
        }
    }, [metaDataValue?.status]);

    useEffect(() => {
        if (isShowMeta) {
            Animated.timing(fadeAnimation, {
                toValue: 1,
                delay: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [isShowMeta])

    useEffect(() => {
        Pusher.logToConsole = false;

        var pusher = new Pusher('50e720f2e2719b2951b5', {
            cluster: 'ap1',
        });

        if (chatId || newChatId) {
            var channel = pusher.subscribe(`${KEY_CHAT}-channel-${chatId || newChatId}`);

            channel.bind(`${KEY_CHAT}-event-${chatId || newChatId}`, function (data: any) {
                // setMessages((prev: any) => [data.data, ...prev]);
                if (data.data === null) {
                    console.log('masuk sini nggk?');
                    forceUpdate();
                    setMessage((prev: any) => prev);
                    return;
                }
                setMessages((prev: any) => {
                    const exists = prev.some((message: any) => message._id === data.data?._id);
                    if (exists) {
                        // If the message already exists, return the previous state
                        return prev;
                    }
                    // If not, add the new message at the beginning
                    return [data.data, ...prev];
                });
            });
        }
    }, []);

    useEffect(() => {
        if (isPaginate) {
            getMessages();
        }
    }, [isPaginate])

    const getMessages = (chtId: string = '') => {
        const params = {
            chatId: chatId || chtId,
            userId: profile._id,
            offset: page,
            limit: 20
        };
        getListMessageAPI(params).then(res => {
            setMessages((prev: any) => page === 0 ? res.data : [...prev, ...res.data]);
            setTotalPage(res.pagination);
            setIsPaginate(false);
        }).catch(err => {
            console.log('list message : ', err);
        });
    }

    const updateStatusRead = () => {
        updateStatusReadAPI(chatId).then(() => {
        }).catch(err => {
            console.log(err);
        });
    }

    const onClearMeta = () => {
        setMetaData({
            data: {
                title: '',
                description: '',
                image: '',
                url: '',
            },
            status: false,
        });
        setIsShowMeta(false);
    }

    const onSubmit = () => {
        let data;
        if (chatId || newChatId) {
            data = {
                chatId: chatId || newChatId,
                message,
                receiver: profile._id,
                category: 'exist',
                meta: metaDataValue.status ? metaDataValue.data : null
            }
        } else {
            if (messages.length > 0) {
                data = {
                    message,
                    receiver: profile._id,
                    category: 'exist',
                    meta: metaDataValue.status ? metaDataValue.data : null
                }
            } else {
                data = {
                    message,
                    receiver: profile._id,
                    category: 'new',
                    meta: metaDataValue.status ? metaDataValue.data : null
                }
            }
        }
        sendMessageAPI(data).then((res) => {
            console.log('send : ', res.data);
            getMessages(!chatId ? res.data.id : '');
            setNewChatId(res.data.id);
            setMessage('');
            onClearMeta();
        }).catch(err => {
            console.log(err);
        });
    }

    const onEndReach = () => {
        if (page == totalPage) {
            return
        }

        setPage(page + 1);
        setIsPaginate(true);
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Header fontSizeTitle={16} color={colors.black} titleHeader={profile?.fullName} onPress={() => navigation.goBack()} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
                        data={messages}
                        keyExtractor={(item: any, index: any) => index}
                        renderItem={({ item }) => (
                            <ListChat
                                isMe={item.sender?._id === userIdLogin}
                                message={item.message}
                                statusRead={item.statusRead}
                                time={moment(new Date(item.createdAt)).fromNow(true)}
                                meta={item.meta}
                            />
                        )}
                        inverted
                        showsVerticalScrollIndicator={false}
                        onEndReached={onEndReach}
                        onEndReachedThreshold={0.9}
                    />
                    <View style={{ paddingTop: 10 }}>
                        <PreviewMetaChat fadeAnimation={fadeAnimation} onPress={onClearMeta} />
                        <InputChat value={message} onChangeText={(value: string) => setMessage(value)} onSend={onSubmit} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

export default ChatRoom;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
    },
    containerMeta: {
        flexDirection: 'row',
        backgroundColor: colors.gray,
        marginBottom: 5,
        alignItems: 'center',
    },
    titleMeta: {
        fontSize: 16,
        fontFamily: fonts.bold,
        color: colors.black,
        marginBottom: 2,
    },
    descMeta: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.black,
    },
    urlMeta: {
        fontSize: 8,
        fontFamily: fonts.normal,
        color: colors.black,
    },
});