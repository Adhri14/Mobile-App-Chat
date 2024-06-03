import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, StatusBar, TextInput } from "react-native";
import Header from "../components/Header";
import SearchInput from "../components/SearchInput";
import ListMessage from "../components/ListMessage";
import ListEmpty from "../components/ListEmpty";
import { ListUsersScreenTypes } from "../router";
import { getUsersAPI } from "../api/user";
import { ProfileStateType } from "./Profile";
import { imageURL } from "../utils/httpService";

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
            console.log(`${search} : `, res.data);
            setRefreshing(false);
            const newArray: ProfileStateType[] = [];
            if (Array.isArray(res.data)) {
                res.data.map((item: ProfileStateType) => {
                    newArray.push(item);
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
                            image={item.image !== null ? { uri: `${imageURL}/${item.image}` } : undefined}
                            name={item.fullName}
                            message={`@${item.username}`}
                            onPress={() => navigation.navigate('Profile', { logout: false, userId: item._id })}
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