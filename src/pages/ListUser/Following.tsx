import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ProfileStateType } from "../Profile";
import { getProfileById } from "../../api/user";
import { colors, fonts } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../router";
import { StackNavigationProp } from "@react-navigation/stack";

export default function Following({ userId }: { userId: string }) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [profile, setProfile] = useState<ProfileStateType>({
        following: []
    });

    useEffect(() => {
        if (userId) {
            getProfileById(userId).then(res => {
                setProfile({
                    ...profile,
                    following: res.data.following,
                });
            }).catch(err => {
                console.log(err);
            });
        }
    }, [userId]);

    return (
        <View style={styles.page}>
            <FlatList
                data={profile.following}
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