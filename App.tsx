import messaging from "@react-native-firebase/messaging";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { NativeModules, PermissionsAndroid, Platform, SafeAreaView } from "react-native";
import { getBaseOsSync, getDeviceNameSync, getDeviceSync, getFirstInstallTimeSync, getIpAddressSync, getSystemName, getSystemVersion, getUniqueIdSync, getUserAgentSync } from 'react-native-device-info';
import FlashMessage from "react-native-flash-message";
import Router from "./src/router.tsx";
import { setDataStorage } from "./src/utils/localStorage.ts";
import { navigationRef } from "./src/utils/navigationRef.ts";
import pushNotification from "./src/utils/pushNotification.ts";
import { registerDeviceAPI } from "./src/api/device.ts";
import { RecoilRoot } from "recoil";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const App = () => {
    useEffect(() => {
        requestNotifPerm();
        registerDevice();
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

    const registerDevice = async () => {
        try {
            const deviceId = getUniqueIdSync();
            const baseOS = getBaseOsSync();
            const device = getDeviceSync();
            const deviceName = getDeviceNameSync();
            const ipAddress = getIpAddressSync();
            const firstInstallTime = getFirstInstallTimeSync();
            const systemName = await getSystemName();
            const systemVersion = await getSystemVersion();
            const userAgent = getUserAgentSync();

            const payload = {
                deviceId,
                baseOS,
                device,
                deviceName,
                ipAddress,
                firstInstallTime,
                systemName,
                systemVersion,
                userAgent,
            };

            console.log('cek payload : ', payload);

            const res = await registerDeviceAPI(payload);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <RecoilRoot>
            <NavigationContainer ref={navigationRef} onReady={() => Platform.OS === 'android' && NativeModules.SplashScreenModule?.hide()}>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <Router />
                    <FlashMessage position="top" />
                </SafeAreaView>
            </NavigationContainer>
        </RecoilRoot>
    );
}

export default App;
