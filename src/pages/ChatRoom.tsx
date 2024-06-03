import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, ImageBackground, FlatList } from "react-native";
import Header from "../components/Header";
import { colors } from "../assets/theme";
import { ChatRoomScreenTypes } from "../router";
import InputChat from "../components/InputChat";
import ListChat from "../components/ListChat";
import { sendMessageAPI } from "../api/chat";

// const messages = [
//     {
//         id: '123123123',
//         message: 'Halo selamat pagi',
//         statusRead: true,
//         createdAt: new Date(),
//         isMe: true,
//     },
//     {
//         id: '12312223123',
//         message: 'Halo selamat pagi',
//         statusRead: true,
//         createdAt: new Date(),
//         isMe: true,
//     },
//     {
//         id: '12123123',
//         message: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam dolor vel fugiat ab quasi eveniet, alias',
//         statusRead: true,
//         createdAt: new Date(),
//         isMe: false,
//     },
//     {
//         id: '123123123',
//         message: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam dolor vel fugiat ab quasi eveniet, alias consectetur optio eos esse molestiae vitae modi excepturi explicabo ex quaerat, rem natus. Eius',
//         statusRead: false,
//         createdAt: new Date(),
//         isMe: true,
//     }
// ];

const ChatRoom = ({ navigation }: ChatRoomScreenTypes) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const onSubmit = () => {
        sendMessageAPI().then(res => {
            console.log(res.data);
            setMessages(res.data);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Header fontSizeTitle={16} color={colors.black} titleHeader="Adhri" onPress={() => navigation.goBack()} />
            <ImageBackground source={require('../assets/images/wallpaper.webp')} resizeMode="cover" style={styles.container}>
                <FlatList
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20 }}
                    data={messages}
                    keyExtractor={(item: any, index: any) => index}
                    renderItem={({ item }) => (
                        <ListChat
                            isMe={item.isMe}
                            message={item.message}
                            statusRead={item.statusRead}
                            time={item.createdAt.toDateString()}
                        />
                    )}
                    inverted
                    showsVerticalScrollIndicator={false}
                />
                <InputChat value={message} onChangeText={(value: string) => setMessage(value)} onSend={onSubmit} />
            </ImageBackground>
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