import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { followUserAPI, getProfile, getProfileById, unFollowUserAPI } from "../api/user";
import { colors } from "../assets/theme";
import Button from "../components/Button";
import Header from "../components/Header";
import HeadStatisticProfile from "../components/HeadStatisticProfile";
import { ProfileScreenTypes } from "../router";
import { clearDataStorage } from "../utils/localStorage";

export type ProfileStateType = {
    fullName?: string;
    username?: string;
    _id?: string;
    email?: string;
    image?: any;
    bio?: string;
    followers?: string[];
    following?: string[];
}

const Profile = ({ navigation, route }: ProfileScreenTypes) => {
    const { logout = false, userId = '' }: any = route.params;
    const isFocused = useIsFocused();
    const [profile, setProfile] = useState<ProfileStateType>({
        fullName: '',
        username: '',
        _id: '',
        email: '',
        bio: '',
        image: null,
        followers: [],
        following: []
    });
    const [userLogin, setUserLogin] = useState('');

    useEffect(() => {
        console.log('user : ', userId);
        if (isFocused) {
            if (userId !== '') {
                getDataUser();
            } else {
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
        }
    }, [isFocused, userId]);

    const getDataUser = () => {
        getProfileById(userId).then(res => {
            setProfile({
                ...profile,
                ...res.data,
                image: JSON.parse(res.data.image)
            });
        }).catch(err => {
            console.log(err);
        });
        getProfile().then(res => {
            setUserLogin(res.data._id);
        }).catch(err => {
            console.log(err);
        });
    }

    const onSignOut = () => {
        clearDataStorage(['token_user']);
        navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
    }

    const onAction = () => {
        if (userId !== '') {
            const isFollowing = profile?.followers?.find(item => item === userLogin)
            if (isFollowing) {
                onUnFollowing();
            } else {
                onFollowing();
            }
        } else {
            navigation.navigate('UpdateProfile');
        }
    }

    const onFollowing = () => {
        followUserAPI(userId).then((res) => {
            getDataUser();
        }).catch(err => {
            console.log(err);
        });
    }

    const onUnFollowing = () => {
        unFollowUserAPI(userId).then((res) => {
            getDataUser();
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <View style={styles.page}>
            <Header isBack titleHeader={profile?.username || 'Akun'} color={colors.black} fontSizeTitle={16} onPress={() => navigation.goBack()} />
            <View style={styles.container}>
                <HeadStatisticProfile
                    image={{ uri: profile?.image !== null ? `${profile?.image?.url}` : 'https://i.pravatar.cc/300' }}
                    totalPosting={34}
                    totalFollowers={Number(profile?.followers?.length) || 0}
                    totalFollowing={Number(profile?.following?.length) || 0}
                    fullname={`${profile?.fullName}`}
                    onNavigate={onAction}
                    bio={profile?.bio}
                    logout={logout}
                    isFollowing={Boolean(profile?.followers?.find(item => item === userLogin))}
                    onMessage={() => navigation.navigate('ChatRoom', { profile, chatId: '' })}
                />
                {Boolean(logout) && <Button style={[{ backgroundColor: 'red' }]} label="Keluar" onPress={onSignOut} />}
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