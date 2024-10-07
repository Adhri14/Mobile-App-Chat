import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SearchInput from "../components/SearchInput";
import ListMessage from "../components/ListMessage";
import { HomeScreenTypes } from "../router";
import { getProfile } from "../api/user";
import { ProfileStateType } from "./Profile";
import { imageURL } from "../utils/httpService";
import { useIsFocused } from "@react-navigation/native";
import { getListChatsAPI } from "../api/chat";
import ListEmpty from "../components/ListEmpty";
import { colors, fonts } from "../assets/theme";
import moment from "moment";
import Pusher from "pusher-js/react-native";

const KEY_MESSAGE = "conversation-messages-";

const Home = ({ navigation }: HomeScreenTypes) => {
    const isFocused = useIsFocused();
    const [profile, setProfile] = useState<ProfileStateType>();
    const [chats, setChats] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (isFocused) {
            getProfileAPI();
            getListChat();
        }
    }, [isFocused]);

    useEffect(() => {
        Pusher.logToConsole = false;

        var pusher = new Pusher('50e720f2e2719b2951b5', {
            cluster: 'ap1',
        });

        var channel = pusher.subscribe(`${KEY_MESSAGE}-channel`);
        channel.bind(`${KEY_MESSAGE}-event`, function (data: any) {
            // setMessages((prev: any) => [data.data, ...prev]);
            setChats((prev: any) => [...data.data]);
        });
    }, [profile?._id]);

    const getProfileAPI = () => {
        getProfile().then(res => {
            setProfile({
                ...profile,
                ...res.data,
                image: JSON.parse(res.data.image)
            });
        }).catch(err => {
            console.log(err);
        });
    }

    const getListChat = () => {
        getListChatsAPI().then(res => {
            setChats(res.data);
        }).catch(err => {
            console.log('list chat api : ', err);
        });
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Header isBack={false} iconRight onPressNewChat={() => navigation.navigate('ListUsers')} onPressAvatar={() => navigation.navigate('Profile', { logout: true })} avatar={profile?.image === null ? undefined : { uri: `${profile?.image?.url}` }} />
            <View style={styles.container}>
                {/* {console.log(chats[0].participants)} */}
                <FlatList
                    ListHeaderComponent={
                        <View>
                            <SearchInput value={search} onChangeText={(text: string) => setSearch(text)} />
                            <Text style={styles.title}>Chats</Text>
                        </View>
                    }
                    data={chats}
                    keyExtractor={(item: any) => item?._id}
                    renderItem={({ item }) => {
                        const image = JSON.parse(item.participants?.find((e: any) => e._id !== profile?._id).image);
                        return (
                            <ListMessage
                                image={{ uri: image.url }}
                                name={item.participants?.find((e: any) => e._id !== profile?._id).fullName}
                                message={item.lastMessage}
                                time={moment(new Date(item.createdAt)).fromNow(false)}
                                isNewMessage={item.totalStatusChatUnRead > 0}
                                countNewMessage={item.totalStatusChatUnRead}
                                onPress={() => navigation.navigate('ChatRoom', { profile: item.participants?.find((e: any) => e._id !== profile?._id), chatId: item._id })}
                            />
                        );
                    }}
                    ListEmptyComponent={<ListEmpty message="Belum ada pesan masuk" />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                />
            </View>
        </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 24,
        color: colors.black,
        fontFamily: fonts.bold,
        marginTop: 30,
        marginBottom: 15
    }
});
