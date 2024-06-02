import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, PermissionsAndroid, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProfileStateType } from "./Profile";
import { UpdateProfileScreenTypes } from "../router";
import { getProfile, updateProfile } from "../api/user";
import Header from "../components/Header";
import { colors, fonts } from "../assets/theme";
import { imageURL as imageHTTP } from "../utils/httpService";
import InputText from "../components/InputText";
import Button from "../components/Button";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const UpdateProfile = (props: UpdateProfileScreenTypes) => {
    const { navigation } = props;
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => [0.01, '25%'], []);

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
    const [isUpload, setIsUpload] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getProfileAPI();
        getPermissionCamera();
    }, []);

    const getPermissionCamera = async () => {
        try {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        } catch (error: any) {
            Alert.alert('Attention', error)
        }
    }

    const getProfileAPI = () => {
        getProfile().then(res => {
            console.log(res.data);
            setProfile(res.data);
            setIsUpload(false);
        }).catch(err => {
            console.log(err);
        });
    }

    const onHandleChange = (key: any, value: any) => {
        setProfile({
            ...profile,
            [key]: value,
        })
    }

    const presentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);

    const onOpenCamera = async () => {
        try {
            const result: any = await launchCamera({ quality: 1, maxWidth: 512, maxHeight: 512, mediaType: 'photo' });
            if (Number(result.assets?.length) > 0) {
                setIsUpload(true);
                setImageURL(String(result?.assets[0]?.uri));
                const newImage = {
                    name: result.assets[0].fileName,
                    uri: result.assets[0].uri,
                    type: result.assets[0].type
                }
                onHandleChange('image', newImage);
            }
        } catch (error) {
            console.log(error);
        }
        closeModal();
    }

    const onOpenGallery = async () => {
        try {
            const result: any = await launchImageLibrary({ quality: 1, maxWidth: 512, maxHeight: 512, mediaType: 'photo' });
            if (Number(result.assets?.length) > 0) {
                setIsUpload(true);
                setImageURL(String(result?.assets[0]?.uri));
                const newImage = {
                    name: result.assets[0].fileName,
                    uri: result.assets[0].uri,
                    type: result.assets[0].type
                }
                onHandleChange('image', newImage);
            }
        } catch (error) {
            console.log(error);
        }
        closeModal();
    }

    const onSubmit = () => {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('fullName', profile.fullName);
        formData.append('username', profile.username);
        formData.append('bio', profile.bio || '');
        if (isUpload) {
            console.log('image upload : ', profile.image);
            formData.append('image', profile.image);
        }
        console.log('uplod : ', formData);
        updateProfile(formData).then(res => {
            console.log(res);
            setIsLoading(false);
            getProfileAPI();
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
        });
    }

    console.log('cek image : ', profile);

    return (
        <BottomSheetModalProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.page}>
                    <Header titleHeader="Update Profil" fontSizeTitle={16} color={colors.black} onPress={() => navigation.goBack()} />
                    <View style={styles.container}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <TouchableOpacity style={styles.wrapperAvatar} onPress={presentModal}>
                                <Image style={styles.avatar} source={{ uri: profile.image !== null && !isUpload ? `${imageHTTP}/${profile.image}` : profile.image && isUpload ? imageURL : 'https://i.pravatar.cc/300' }} />
                            </TouchableOpacity>
                            <InputText value={profile.fullName} onChangeText={(value: string) => onHandleChange('fullName', value)} label="Full Name" />
                            <InputText value={profile.username} onChangeText={(value: string) => onHandleChange('username', value)} label="Username" />
                            <InputText value={profile.bio} textArea onChangeText={(value: string) => onHandleChange('bio', value)} label="Bio" />
                            <View style={{ flex: 1 }} />
                            <Button label="Save Profile" onPress={onSubmit} isLoading={isLoading} disabled={isLoading} />
                        </ScrollView>
                    </View>
                </View>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    backdropComponent={props => <BottomSheetBackdrop {...props} opacity={0.3} />}
                >
                    <View style={styles.container}>
                        <Pressable style={styles.btnIcon} onPress={onOpenGallery}>
                            <Image style={styles.icon} source={require('../assets/images/icon-gallery-photo.png')} />
                            <Text style={styles.textIcon}>Choose your photo in gallery</Text>
                        </Pressable>
                        <Pressable style={styles.btnIcon} onPress={onOpenCamera}>
                            <Image style={styles.icon} source={require('../assets/images/icon-camera.png')} />
                            <Text style={styles.textIcon}>Take your photo with camera</Text>
                        </Pressable>
                    </View>
                </BottomSheetModal>
            </GestureHandlerRootView>
        </BottomSheetModalProvider>
    );
}

export default UpdateProfile;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 24
    },
    wrapperAvatar: {
        width: 110,
        height: 110,
        borderRadius: 110 / 2,
        overflow: 'hidden',
        padding: 4,
        backgroundColor: colors.primarySoft,
        alignSelf: 'center',
        marginBottom: 50
    },
    avatar: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 110 / 2
    },
    btnIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10
    },
    icon: {
        width: 30,
        height: 30,
        aspectRatio: 1,
        marginRight: 10,
    },
    textIcon: {
        fontSize: 14,
        fontFamily: fonts.bold,
        color: colors.black,
        lineHeight: 20
    }
});