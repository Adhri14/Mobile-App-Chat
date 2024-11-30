import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import Pusher from "pusher-js/react-native";
import React, { useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { getListChatsAPI } from "../api/chat";
import { getProfile } from "../api/user";
import { colors, fonts } from "../assets/theme";
import Header from "../components/Header";
import ListEmpty from "../components/ListEmpty";
import ListMessage from "../components/ListMessage";
import SearchInput from "../components/SearchInput";
import { HomeScreenTypes } from "../router";
import { ProfileStateType } from "./Profile";

const KEY_MESSAGE = "conversation-messages-";

const Home = ({ navigation }: HomeScreenTypes) => {
    const isFocused = useIsFocused();
    const [profile, setProfile] = useState<ProfileStateType>();
    const [chats, setChats] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    let pusher;

    useEffect(() => {
        if (isFocused) {
            getProfileAPI();
            getListChat();
        }
    }, [isFocused]);

    useEffect(() => {
        if (!profile?._id) return;
        Pusher.logToConsole = true;

        pusher = new Pusher('50e720f2e2719b2951b5', {
            cluster: 'ap1',
        });

        var channel = pusher.subscribe(`${KEY_MESSAGE}-channel-${profile?._id}`);
        channel.bind(`${KEY_MESSAGE}-event-${profile?._id}`, function (data: any) {
            // setMessages((prev: any) => [data.data, ...prev]);
            setChats((prev: any) => [...data.data]);
        });
    }, [pusher, profile?._id]);

    useEffect(() => {
        if (refreshing) {
            getListChat();
            getProfileAPI();
        }
    }, [refreshing]);

    const getProfileAPI = () => {
        getProfile().then(res => {
            setProfile({
                ...profile,
                ...res.data,
                image: JSON.parse(res.data.image)
            });
            setRefreshing(false);
        }).catch(err => {
            console.log(err);
        });
    }

    const getListChat = () => {
        getListChatsAPI().then(res => {
            setChats(res.data);
            setRefreshing(false);
        }).catch(err => {
            console.log('list chat api : ', err);
        });
    }

    const onRefresh = () => {
        setRefreshing(true);
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
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    data={chats}
                    keyExtractor={(item: any) => item?._id}
                    renderItem={({ item }) => {
                        const image = JSON.parse(item.participants?.find((e: any) => e._id !== profile?._id).image);
                        return (
                            <ListMessage
                                image={{ uri: image.url }}
                                name={item.participants?.find((e: any) => e._id !== profile?._id).fullName}
                                message={item.lastMessage}
                                time={moment(new Date(item.updatedAt)).fromNow(true)}
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
