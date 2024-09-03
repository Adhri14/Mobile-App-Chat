import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./src/router.tsx";
import { NativeModules, PermissionsAndroid, Platform, SafeAreaView } from "react-native";
import { navigationRef } from "./src/utils/navigationRef.ts";
import messaging from "@react-native-firebase/messaging";
import pushNotification from "./src/utils/pushNotification.ts";
import { setDataStorage } from "./src/utils/localStorage.ts";
import FlashMessage from "react-native-flash-message";

const App = () => {
    useEffect(() => {
        requestNotifPerm();
    }, []);

    useEffect(() => {
        pushNotification.configure();
        pushNotification.createChannelId({ channelId: 'fcm_fallback_notification_channel' });
        const requestPermission = async () => {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                pushNotification.configureIOS();
            }
        };

        const getToken = async () => {
            const token = await messaging().getToken();
            console.log(token);
            await setDataStorage('device_token', { token });
        }

        requestPermission();
        getToken();

        const onNotification = (datanya: any) => {
            const { messageId, title, body, data } = datanya;
            pushNotification.showNotification(messageId, title, body, data);
        };

        const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
            if (remoteMessage) {
                const item = {
                    name: remoteMessage.notification.data?.name,
                    email: remoteMessage.notification.data?.email,
                    image: remoteMessage.notification.data?.image,
                    nameEvent: remoteMessage.notification.data?.nameEvent,
                    routeScreen: 'message',
                };
                const data = {
                    messageId: remoteMessage.messageId,
                    title: remoteMessage.notification.title,
                    body: remoteMessage.notification.body,
                    data: item
                };

                console.log('remote message : ', remoteMessage);

                onNotification(data);
            }
        });

        const unsubsOpenApp = messaging().onNotificationOpenedApp(
            async remoteMessage => {
                // alert('notif dibuka', remoteMessage.data);
                console.log('noti di buka : ', remoteMessage.data);
            },
        );

        return () => {
            unsubscribe();
            unsubsOpenApp();
        };
    });

    const requestNotifPerm = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        }
    }

    return (
        <NavigationContainer ref={navigationRef} onReady={() => Platform.OS === 'android' && NativeModules.SplashScreenModule?.hide()}>
            <SafeAreaView style={{ flex: 1 }}>
                <Router />
                <FlashMessage position="top" />
            </SafeAreaView>
        </NavigationContainer>
    );
}

export default App;
