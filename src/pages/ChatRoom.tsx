import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import React, { ReactNode, useEffect, useState } from "react";
import { FlatList, ImageBackground, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, View } from "react-native";
import { getListMessageAPI, sendMessageAPI, updateStatusReadAPI } from "../api/chat";
import { getProfile } from "../api/user";
import { colors } from "../assets/theme";
import Header from "../components/Header";
import InputChat from "../components/InputChat";
import ListChat from "../components/ListChat";
import { ChatRoomScreenTypes } from "../router";
import Pusher from 'pusher-js/react-native';

const WrapperImage = ({ children }: { children: ReactNode }) => {
    return Platform.OS == 'ios' ? <View style={styles.container}>{children}</View> : <ImageBackground source={require('../assets/images/wallpaper.webp')} resizeMode="cover" style={styles.container}>{children}</ImageBackground>;
}

const KEY_CHAT = "conversation-chats-";

const ChatRoom = ({ navigation, route }: ChatRoomScreenTypes) => {
    let { profile, chatId }: any = route.params;
    const isFocused = useIsFocused();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any>([]);
    const [userIdLogin, setUserIdLogin] = useState('');
    const [newChatId, setNewChatId] = useState('');
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [isPaginate, setIsPaginate] = useState(false);
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
        Pusher.logToConsole = false;

        var pusher = new Pusher('50e720f2e2719b2951b5', {
            cluster: 'ap1',
        });

        if (chatId || newChatId) {
            var channel = pusher.subscribe(`${KEY_CHAT}-channel-${chatId || newChatId}`);
            channel.bind(`${KEY_CHAT}-event-${chatId || newChatId}`, function (data: any) {
                // setMessages((prev: any) => [data.data, ...prev]);
                setMessages((prev: any) => {
                    const exists = prev.some((message: any) => message._id === data.data._id);
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
            limit: 10
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

    const onSubmit = () => {
        let data;
        if (chatId || newChatId) {
            data = {
                chatId: chatId || newChatId,
                message,
                receiver: profile._id,
                category: 'exist'
            }
        } else {
            if (messages.length > 0) {
                data = {
                    message,
                    receiver: profile._id,
                    category: 'exist'
                }
            } else {
                data = {
                    message,
                    receiver: profile._id,
                    category: 'new'
                }
            }
        }
        sendMessageAPI(data).then((res) => {
            console.log('send : ', res.data);
            getMessages(!chatId ? res.data.id : '');
            setNewChatId(res.data.id);
            setMessage('');
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

    console.log(page);

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
                                time={moment(new Date(item.createdAt)).fromNow()}
                            />
                        )}
                        inverted
                        showsVerticalScrollIndicator={false}
                        onEndReached={onEndReach}
                        onEndReachedThreshold={0.9}
                    />
                    <InputChat value={message} onChangeText={(value: string) => setMessage(value)} onSend={onSubmit} />
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
    }
});