import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import Header from "../components/Header";
import { ProfileScreenTypes } from "../router";
import { colors, fonts } from "../assets/theme";
import Button from "../components/Button";
import { clearDataStorage } from "../utils/localStorage";
import { getProfile } from "../api/user";
import { appURL } from "../utils/httpService";
import HeadStatisticProfile from "../components/HeadStatisticProfile";
import { useIsFocused } from "@react-navigation/native";

export type ProfileStateType = {
    fullName: string;
    username: string;
    id: string;
    email: string;
    image: any;
    bio: string;
    followers?: string[];
    following?: string[];
}

const Profile = ({ navigation }: ProfileScreenTypes) => {
    const isFocused = useIsFocused();
    const [profile, setProfile] = useState<ProfileStateType>({
        fullName: '',
        username: '',
        id: '',
        email: '',
        bio: '',
        image: null,
        followers: [],
        following: []
    });

    useEffect(() => {
        if (isFocused) {
            getProfile().then(res => {
                console.log(res.data);
                setProfile(res.data);
            }).catch(err => {
                console.log(err);
            });
        }
    }, [isFocused]);

    const onSignOut = () => {
        clearDataStorage(['token_user']);
        navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
    }

    return (
        <View style={styles.page}>
            <Header isBack titleHeader={profile.username || 'Akun'} color={colors.black} fontSizeTitle={16} onPress={() => navigation.goBack()} />
            <View style={styles.container}>
                <HeadStatisticProfile
                    image={{ uri: profile.image ? `${appURL}/uploads/${profile.image}` : 'https://i.pravatar.cc/300' }}
                    totalPosting={34}
                    totalFollowers={Number(profile.followers?.length) || 0}
                    totalFollowing={Number(profile.following?.length) || 0}
                    fullname={profile.fullName}
                    onNavigate={() => navigation.navigate('UpdateProfile')}
                />
                <Button style={[{ backgroundColor: 'red' }]} label="Keluar" onPress={onSignOut} />
            </View>
        </View>
    );
}

export default Profile;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        paddingBottom: 24
    },
});