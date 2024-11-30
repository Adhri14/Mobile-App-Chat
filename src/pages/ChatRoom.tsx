import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import Pusher from 'pusher-js/react-native';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, FlatList, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getListMessageAPI, sendMessageAPI, updateStatusReadAPI } from "../api/chat";
import { getProfile } from "../api/user";
import { colors, fonts } from "../assets/theme";
import Header from "../components/Header";
import InputChat from "../components/InputChat";
import ListChat from "../components/ListChat";
import useForceUpdate from "../hooks/useForceUpdate";
import { metaDataState, MetaDataType } from "../recoil/state";
import { ChatRoomScreenTypes } from "../router";
import Ionicons from "react-native-vector-icons/Ionicons";
import PreviewMetaChat from "../components/PreviewMetaChat";
import { ProfileStateType } from "./Profile";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ModalPreviewImage from "../components/ModalPreviewImage";
import { uploadFileAPI } from "../api/media";
import { ImageZoom } from "@likashefqet/react-native-image-zoom"

const WrapperImage = ({ children }: { children: ReactNode }) => {
    return Platform.OS == 'ios' ? <View style={styles.container}>{children}</View> : <ImageBackground source={require('../assets/images/wallpaper.webp')} resizeMode="cover" style={styles.container}>{children}</ImageBackground>;
}

const KEY_CHAT = "conversation-chats-";

const initValue = {
    title: '',
    description: '',
    image: '',
    url: '',
};

export type ResultFileTypes = {
    userId: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    bytes: number;
    type: string;
    url: string;
}

const ChatRoom = ({ navigation, route }: ChatRoomScreenTypes) => {
    let { profile, chatId }: any = route.params;
    const { forceUpdate } = useForceUpdate();
    const isFocused = useIsFocused();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any>([]);
    const [userIdLogin, setUserIdLogin] = useState('');
    const [newChatId, setNewChatId] = useState('');
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isPaginate, setIsPaginate] = useState(false);
    const [metaTagging, setMetaTagging] = useState<MetaDataType>(initValue);
    const [isShowMeta, setIsShowMeta] = useState(false);
    const [showTabbar, setShowTabbar] = useState(true);
    const [isUpload, setIsUpload] = useState<boolean>(false);
    const [urlImage, setIsUrlImage] = useState<string>('');
    const [resultFile, setResultFile] = useState<ResultFileTypes>();
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [loadImage, setLoadImage] = useState(false);
    const [previewImage, setPreviewImage] = useState(false);
    const metaDataValue = useRecoilValue(metaDataState);
    const setMetaData = useSetRecoilState(metaDataState);
    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => [0.1, '20%'], []);

    useEffect(() => {
        const subscribeShow = Keyboard.addListener('keyboardDidShow', (event) => {
            setShowTabbar(false);
        });
        const subscribeHide = Keyboard.addListener('keyboardDidHide', (event) => {
            setShowTabbar(true);
        });
        return () => {
            subscribeShow.remove();
            subscribeHide.remove();
        }
    }, [showTabbar]);
    // const [showTabbar, setShowTabbar] = useState(true);

    useEffect(() => {
        if (isFocused) {
            if (chatId) {
                updateStatusRead();
            }
            getMessages();
            getProfile().then(res => {
                setUserIdLogin(res.data._id);
            }).catch(err => {
                console.log(err);
            });
        }
    }, [isFocused]);

    useEffect(() => {
        if (metaDataValue?.status) {
            setMetaTagging(metaDataValue?.data!);
            setIsShowMeta(true);
        } else {
            setMetaTagging(initValue);
            setIsShowMeta(false);
        }
    }, [metaDataValue?.status]);

    useEffect(() => {
        if (isShowMeta) {
            Animated.timing(fadeAnimation, {
                toValue: 1,
                delay: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [isShowMeta]);

    useEffect(() => {
        Pusher.logToConsole = false;

        var pusher = new Pusher('50e720f2e2719b2951b5', {
            cluster: 'ap1',
        });

        if (chatId || newChatId) {
            var channel = pusher.subscribe(`${KEY_CHAT}-channel-${chatId || newChatId}`);
            channel.bind(`${KEY_CHAT}-event-${chatId || newChatId}`, function (data: any) {
                // setMessages((prev: any) => [data.data, ...prev]);
                if (data.data === null) {
                    console.log('masuk sini nggk?');
                    forceUpdate();
                    setMessage((prev: any) => prev);
                    return;
                }
                setMessages((prev: any) => {
                    const exists = prev.some((message: any) => message._id === data.data?._id);
                    if (exists) {
                        // If the message already exists, return the previous state
                        return prev;
                    }
                    // If not, add the new message at the beginning
                    return [data.data, ...prev];
                });
            });
        }
    }, []);

    useEffect(() => {
        if (isPaginate) {
            getMessages();
        }
    }, [isPaginate])

    const getMessages = (chtId: string = '') => {
        const params = {
            chatId: chatId || chtId,
            userId: profile._id,
            offset: page,
            limit: 20
        };
        getListMessageAPI(params).then(res => {
            setMessages((prev: any) => page === 0 ? res.data : [...prev, ...res.data]);
            setTotalPage(res.pagination.totalPages);
            setIsPaginate(false);
        }).catch(err => {
            console.log('list message : ', err);
        });
    }

    const updateStatusRead = () => {
        updateStatusReadAPI(chatId).then(() => {
        }).catch(err => {
            console.log(err);
        });
    }

    const onClearMeta = () => {
        setMetaData({
            data: {
                title: '',
                description: '',
                image: '',
                url: '',
            },
            status: false,
        });
        setIsShowMeta(false);
    }

    const onSubmit = () => {
        let data;
        if (chatId || newChatId) {
            data = {
                chatId: chatId || newChatId,
                message,
                receiver: profile._id,
                category: 'exist',
                meta: metaDataValue.status ? metaDataValue.data : null,
                media: resultFile ? resultFile : null
            }
        } else {
            if (messages.length > 0) {
                data = {
                    message,
                    receiver: profile._id,
                    category: 'exist',
                    meta: metaDataValue.status ? metaDataValue.data : null,
                    media: resultFile ? resultFile : null,
                }
            } else {
                data = {
                    message,
                    receiver: profile._id,
                    category: 'new',
                    meta: metaDataValue.status ? metaDataValue.data : null,
                    media: resultFile ? resultFile : null
                }
            }
        }
        sendMessageAPI(data).then((res) => {
            getMessages(!chatId ? res.data.id : '');
            setNewChatId(res.data.id);
            setMessage('');
            onClearMeta();
            setIsUpload(false);
            setIsUrlImage('');
            setResultFile(undefined);
        }).catch(err => {
            console.log(err);
        });
    }

    const onEndReach = useCallback(() => {
        console.log({
            page,
            totalPage
        })
        if (totalPage < page) {
            setIsPaginate(false);
            return;
        }
        setPage(page + 1);
        setIsPaginate(true);
        return;
    }, [totalPage, page]);

    const presentModal = useCallback(() => {
        Keyboard.dismiss();
        bottomSheetModalRef.current?.present();
    }, []);

    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);

    const onOpenCamera = async () => {
        setIsLoadingImage(true);
        try {
            const result: any = await launchCamera({ quality: 1, maxWidth: 1024, maxHeight: 1024, mediaType: 'photo' });
            if (Number(result.assets?.length) > 0) {
                setIsUpload(true);
                setIsUrlImage(String(result?.assets[0]?.uri));
                const newImage = {
                    name: result.assets[0].fileName,
                    uri: result.assets[0].uri,
                    type: result.assets[0].type
                }
                // onHandleChange('image', newImage);
                const formData = new FormData();
                formData.append('file', newImage);
                const dataImage = await uploadFileAPI(formData);
                setResultFile(dataImage?.data);
                setIsLoadingImage(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoadingImage(false);
        }
        closeModal();
    }

    const onOpenGallery = async () => {
        setIsLoadingImage(true);
        try {
            const result: any = await launchImageLibrary({ quality: 1, maxWidth: 1024, maxHeight: 1024, mediaType: 'photo' });
            if (Number(result.assets?.length) > 0) {
                setIsUpload(true);
                setIsUrlImage(String(result?.assets[0]?.uri));
                const newImage = {
                    name: result.assets[0].fileName,
                    uri: result.assets[0].uri,
                    type: result.assets[0].type
                }
                const formData = new FormData();
                formData.append('file', newImage);
                const dataImage = await uploadFileAPI(formData);
                setResultFile(dataImage?.data);
                setIsLoadingImage(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoadingImage(false);
        }
        closeModal();
    }

    const onPreviewImage = (url: string) => {
        setIsUrlImage(url);
        setPreviewImage(true);
        setLoadImage(true);
    }

    return (
        <BottomSheetModalProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.page}>
                    <StatusBar backgroundColor="white" barStyle="dark-content" />
                    <Header fontSizeTitle={16} color={colors.black} titleHeader={profile?.fullName} onPress={() => navigation.goBack()} />
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
                                data={messages}
                                keyExtractor={(item: any, index: any) => index}
                                renderItem={({ item }) => {
                                    item.loadImage = true;
                                    return (
                                        <ListChat
                                            isMe={item.sender?._id === userIdLogin}
                                            message={item.message}
                                            statusRead={item.statusRead}
                                            time={moment(new Date(item.createdAt)).fromNow(true)}
                                            meta={item.meta}
                                            media={item.media ? item.media : undefined}
                                            onPreviewImage={() => item.media ? onPreviewImage(item.media?.url) : null}
                                            onLoadEndImage={() => item.loadImage = false}
                                        />
                                    );
                                }}
                                inverted
                                showsVerticalScrollIndicator={false}
                                onEndReached={onEndReach}
                                onEndReachedThreshold={0.1}
                                ListFooterComponent={(
                                    isPaginate ? (<View style={{ alignSelf: 'center' }}>
                                        <ActivityIndicator color={colors.primaryBold} size={30} />
                                    </View>) : null
                                )}
                            />
                            <View style={{ paddingTop: 10 }}>
                                <PreviewMetaChat fadeAnimation={fadeAnimation} onPress={onClearMeta} />
                                <InputChat value={message} component onChangeText={(value: string) => setMessage(value)} onSend={onSubmit} disabled={message.trim() === ''} onAddComponent={presentModal} styleContainer={{ marginBottom: Platform.OS === 'ios' && !showTabbar ? 70 : Platform.OS === 'android' ? 20 : 0 }} />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={(index) => {
                        if (index === 0) {
                            closeModal();
                        }
                    }}
                    backdropComponent={props => <BottomSheetBackdrop {...props} opacity={0.3} />}
                >
                    <View style={[styles.container, { paddingHorizontal: 24, flexWrap: 'wrap', gap: 15, width: '100%', flexDirection: 'row' }]}>
                        <Pressable style={styles.btnIcon} onPress={onOpenGallery}>
                            <Image style={styles.icon} source={require('../assets/images/icon-gallery-photo.png')} />
                            <Text style={styles.textIcon}>Gallery</Text>
                        </Pressable>
                        <Pressable style={styles.btnIcon} onPress={onOpenCamera}>
                            <Image style={styles.icon} source={require('../assets/images/icon-camera.png')} />
                            <Text style={styles.textIcon}>Camera</Text>
                        </Pressable>
                    </View>
                </BottomSheetModal>
                <ModalPreviewImage visible={isUpload} onRequestClose={() => setIsUpload(false)}>
                    <Pressable style={styles.btnCloseModal} onPress={() => setIsUpload(false)}>
                        <Text style={{ color: colors.white, fontSize: 30, lineHeight: 35 }}>&times;</Text>
                    </Pressable>
                    {Platform.OS === 'android' ? (
                        <Image source={{ uri: urlImage }} resizeMode="contain" style={{ width: '100%', height: '90%' }} />
                    ) : <Image source={{ uri: urlImage }} resizeMode="contain" style={{ width: '100%', height: '90%' }} />}
                    {Platform.OS === 'android' ? (
                        <View style={{ left: 0, right: 0, bottom: !showTabbar ? Dimensions.get('screen').height * 0.31 : 24, position: 'absolute', }}>
                            <InputChat styleContainer={{ position: 'relative', zIndex: 999, backgroundColor: 'transparent', paddingBottom: 10 }} value={message} onChangeText={(value: string) => setMessage(value)} onSend={onSubmit} disabled={message.trim() === ''} />
                        </View>
                    ) : (
                        <View style={{ width: '100%', flex: 1, position: 'absolute', top: 0, left: 0, bottom: 24, right: 0 }}>
                            <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: 'space-between', paddingBottom: 10, }}>
                                {Platform.OS === 'ios' && <ScrollView bounces={false} contentContainerStyle={{ flexGrow: !showTabbar ? 1 : 0, backgroundColor: 'rgba(0,0,0,0.5)' }}></ScrollView>}
                                <InputChat styleContainer={{ position: 'relative', zIndex: 999, backgroundColor: !showTabbar ? 'rgba(0,0,0,0.5)' : 'transparent', paddingBottom: 10 }} value={message} onChangeText={(value: string) => setMessage(value)} onSend={onSubmit} />
                            </KeyboardAvoidingView>
                        </View>
                    )}
                    {isLoadingImage && (
                        <View style={styles.overlay}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    )}
                </ModalPreviewImage>
                <ModalPreviewImage visible={previewImage} onRequestClose={() => {
                    setPreviewImage(false);
                    setIsUrlImage('');
                }}>
                    <Pressable style={styles.btnCloseModal} onPress={() => {
                        setPreviewImage(false);
                        setIsUrlImage('');
                    }}>
                        <Text style={{ color: colors.white, fontSize: 30, lineHeight: 35 }}>&times;</Text>
                    </Pressable>
                    <ImageZoom
                        uri={urlImage}
                        resizeMode="contain"
                        style={{ width: '100%', height: '90%' }}
                        onLoadEnd={() => setLoadImage(false)}
                    />
                </ModalPreviewImage>
            </GestureHandlerRootView>
        </BottomSheetModalProvider>
    );
}

export default ChatRoom;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
    },
    containerMeta: {
        flexDirection: 'row',
        backgroundColor: colors.gray,
        marginBottom: 5,
        alignItems: 'center',
    },
    titleMeta: {
        fontSize: 16,
        fontFamily: fonts.bold,
        color: colors.black,
        marginBottom: 2,
    },
    descMeta: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.black,
    },
    urlMeta: {
        fontSize: 8,
        fontFamily: fonts.normal,
        color: colors.black,
    },
    btnIcon: {
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    icon: {
        width: 50,
        height: 50,
        aspectRatio: 1,
        tintColor: colors.primary,
    },
    textIcon: {
        fontSize: 14,
        fontFamily: fonts.bold,
        color: colors.black,
        lineHeight: 20,
        textAlign: 'center'
    },
    btnCloseModal: {
        width: 35,
        height: Platform.OS === 'android' ? 'auto' : 35,
        borderRadius: 40,
        backgroundColor: colors.dark2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 50,
        marginLeft: 10
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    }
});