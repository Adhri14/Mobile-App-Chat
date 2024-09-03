import React, { ReactNode, useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, ImageBackground, FlatList, Platform, KeyboardAvoidingView, Keyboard } from "react-native";
import Header from "../components/Header";
import { colors } from "../assets/theme";
import { ChatRoomScreenTypes } from "../router";
import InputChat from "../components/InputChat";
import ListChat from "../components/ListChat";
import { getListChatsAPI, getListMessageAPI, sendMessageAPI, updateStatusReadAPI } from "../api/chat";
import { ProfileStateType } from "./Profile";
import moment from "moment";
import { getDataStorage } from "../utils/localStorage";
import { getProfile } from "../api/user";
import { useIsFocused } from "@react-navigation/native";

const WrapperImage = ({ children }: { children: ReactNode }) => {
    return Platform.OS == 'ios' ? <View style={styles.container}>{children}</View> : <ImageBackground source={require('../assets/images/wallpaper.webp')} resizeMode="cover" style={styles.container}>{children}</ImageBackground>;
}

const ChatRoom = ({ navigation, route }: ChatRoomScreenTypes) => {
    let { profile, chatId }: any = route.params;
    const isFocused = useIsFocused();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any>([]);
    const [userIdLogin, setUserIdLogin] = useState('');
    const [newChatId, setNewChatId] = useState('');
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

    const getMessages = (chtId: string = '') => {
        const params = {
            chatId: chatId || chtId,
            userId: profile._id,
        }
        getListMessageAPI(params).then(res => {
            setMessages(res.data);
            // setNewChatId(res.data[0].chat?._id);
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

    console.log('cek id : ', newChatId);
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