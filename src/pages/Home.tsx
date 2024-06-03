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

const Home = ({ navigation }: HomeScreenTypes) => {
    const isFocused = useIsFocused();
    const [profile, setProfile] = useState<ProfileStateType>();
    const [offset, setOffset] = useState(0);
    const [chats, setChats] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (isFocused) {
            getProfileAPI();
            getListChat();
        }
    }, [isFocused]);

    const getProfileAPI = () => {
        getProfile().then(res => {
            setProfile(res.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const getListChat = () => {
        getListChatsAPI().then(res => {
            setChats(res.data);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Header isBack={false} iconRight onPressNewChat={() => navigation.navigate('ListUsers')} onPressAvatar={() => navigation.navigate('Profile', { logout: true })} avatar={profile?.image === null ? undefined : { uri: `${imageURL}/${profile?.image}` }} />
            <View style={styles.container}>
                <FlatList
                    ListHeaderComponent={() => (
                        <View style={{ marginBottom: 20 }}>
                            <SearchInput value={search} onChangeText={(text: string) => setSearch(text)} />
                        </View>
                    )}
                    data={chats}
                    renderItem={({ }) => (
                        <ListMessage
                            name="Adhri"
                            message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed nobis delectus error optio velit mollitia iste debitis"
                            time="10.10"
                            isNewMessage={false}
                            onPress={() => navigation.navigate('ChatRoom')}
                        />
                    )}
                    ListEmptyComponent={() => <ListEmpty message="Belum ada pesan masuk" />}
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
});
