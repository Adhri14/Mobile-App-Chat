import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, StatusBar } from "react-native";
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

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (refreshing) {
            getUsers();
        }
    }, [refreshing])

    const getUsers = () => {
        getUsersAPI().then(res => {
            setRefreshing(false);
            setUsers(res.data);
        }).catch(err => {
            setRefreshing(false);
            console.log(err);
        })
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Header isBack onPress={() => navigation.goBack()} />
            <View style={styles.container}>
                <FlatList
                    refreshing={refreshing}
                    onRefresh={() => setRefreshing(true)}
                    ListHeaderComponent={() => (
                        <View style={{ marginBottom: 20 }}>
                            <SearchInput />
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