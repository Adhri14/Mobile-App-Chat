import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable, Image } from "react-native";
import { getProfileById } from "../../api/user";
import { ProfileStateType } from "../Profile";
import { colors, fonts } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../router";

export default function Followers({ userId }: { userId: string }) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [profile, setProfile] = useState<ProfileStateType>({
        followers: []
    });
    useEffect(() => {
        if (userId) {
            getProfileById(userId).then(res => {
                setProfile({
                    ...profile,
                    followers: res.data.followers,
                });
            }).catch(err => {
                console.log(err);
            });
        }
    }, [userId]);

    return (
        <View style={styles.page}>
            <FlatList
                data={profile.followers}
                keyExtractor={(item: any) => item?._id}
                renderItem={({ item }: any) => {
                    const image = JSON.parse(item?.image);
                    return (
                        <Pressable onPress={() => navigation.navigate('Profile', { userId: item?._id, logout: false })} style={styles.content}>
                            <Image source={{ uri: image?.url }} style={styles.avatar} />
                            <View style={styles.wrapper}>
                                <Text style={styles.username}>{item?.username}</Text>
                                <Text style={styles.fullname}>{item?.fullName}</Text>
                            </View>
                        </Pressable>
                    );
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10
    },
    avatar: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 50 / 2
    },
    wrapper: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontFamily: fonts.bold,
        color: colors.black
    },
    fullname: {
        fontSize: 12,
        fontFamily: fonts.medium,
        color: colors.dark
    },
});