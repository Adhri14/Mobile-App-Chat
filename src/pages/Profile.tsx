import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { followUserAPI, getProfile, getProfileById, unFollowUserAPI } from "../api/user";
import { colors } from "../assets/theme";
import Button from "../components/Button";
import Header from "../components/Header";
import HeadStatisticProfile from "../components/HeadStatisticProfile";
import { ProfileScreenTypes } from "../router";
import { clearDataStorage } from "../utils/localStorage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import LottieView from "lottie-react-native";
import Loading from "../components/Loading";

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
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);
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
                    setIsLoading(false);
                }).catch(err => {
                    console.log(err);
                    setIsLoading(false);
                }).finally(() => {
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }).start();
                });
            }
        }
    }, [isFocused, userId, isLoading]);

    const getDataUser = () => {
        getProfileById(userId).then(res => {
            setProfile({
                ...profile,
                ...res.data,
                image: JSON.parse(res.data.image)
            });
            setIsLoading(false);
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
        }).finally(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        });
        getProfile().then(res => {
            setUserLogin(res.data._id);
            setIsLoading(false);
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
        }).finally(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        });
    }

    const onSignOut = async () => {
        clearDataStorage(['token_user']);
        await GoogleSignin.signOut();
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
            <Loading fadeAnim={fadeAnim} isLoading={isLoading} />
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
                    isFollowing={Boolean(profile?.followers?.find((item: any) => item._id === userLogin))}
                    onMessage={() => navigation.navigate('ChatRoom', { profile, chatId: '' })}
                    onNavigateFollowers={() => navigation.navigate('ListUser', { username: profile?.username as string, initialRouteIndex: 0, userId: profile?._id as string })}
                    onNavigateFollowing={() => navigation.navigate('ListUser', { username: profile?.username as string, initialRouteIndex: 1, userId: profile?._id as string })}
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