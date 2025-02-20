import React, { useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import { getUsersAPI } from "../api/user";
import Header from "../components/Header";
import ListEmpty from "../components/ListEmpty";
import ListMessage from "../components/ListMessage";
import SearchInput from "../components/SearchInput";
import { ListUsersScreenTypes } from "../router";
import { ProfileStateType } from "./Profile";

const ListUsers = ({ navigation }: ListUsersScreenTypes) => {
    const [users, setUsers] = useState<ProfileStateType[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (refreshing) {
            getUsers();
        }
    }, [refreshing]);

    useEffect(() => {
        let timeout: any;
        if (search !== '') {
            timeout = setTimeout(getUsers, 500);
        } else {
            getUsers();
        }

        return () => {
            clearTimeout(timeout);
        }
    }, [search]);

    const getUsers = () => {
        getUsersAPI({ search }).then(res => {
            setRefreshing(false);
            const newArray: ProfileStateType[] = [];
            if (Array.isArray(res.data)) {
                res.data.map((item: ProfileStateType) => {
                    newArray.push({
                        ...item,
                        image: item.image !== '' || item.image !== null ? JSON.parse(item.image) : null
                    });
                });
            }
            setUsers(newArray);
        }).catch(err => {
            setRefreshing(false);
            console.log(err);
        })
    }

    const onRefresh = () => {
        setRefreshing(true);
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Header isBack onPress={() => navigation.goBack()} />
            <View style={styles.container}>
                <FlatList
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ListHeaderComponent={(
                        <View style={{ marginBottom: 20 }}>
                            <SearchInput value={search} onChangeText={(text: string) => setSearch(text)} />
                        </View>
                    )}
                    data={users}
                    renderItem={({ item }) => (
                        <ListMessage
                            image={item.image !== null ? { uri: `${item.image?.url}` } : undefined}
                            name={`${item.fullName}`}
                            message={`@${item.username}`}
                            onPress={() => navigation.navigate('Profile', { logout: false, userId: item._id as string })}
                        />
                    )}
                    ListEmptyComponent={() => <ListEmpty message="Belum ada teman" />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                />
            </View>
        </View>
    );
}

export default ListUsers;

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