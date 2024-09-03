import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from './navigationRef';

const pushNotification = {
    device_id: '',
    userInteraction: false,
    configure() {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
                // setDeviceID(token.token);
                console.log('token : ', token.token);
                pushNotification.device_id = token.token;
                // erro nggk mas?belom import redux
            },

            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) {
                // process the notification
                console.log('klik : ', notification);
                const { email, image, nameEvent, type, name } = notification.data;
                if (notification.userInteraction) {
                    pushNotification.userInteraction = notification.userInteraction;
                    // if (type === 'chat') {
                    //     const item = {
                    //         email,
                    //         image,
                    //         nameEvent,
                    //         name,
                    //         routeScreen: 'notification',
                    //     };
                    //     navigationRef.current?.navigate('ChatRoom', { ...item });
                    // }
                }

                // (required) Called when a remote is received or opened, or local notification is opened
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                console.log('ACTION:', notification.action);
                console.log('NOTIFICATION click :', notification);

                // process the action
            },

            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function (err) { },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: Platform.OS === 'ios',
        });
    },
    async configureIOS() {
        try {
            const fcmToken = await messaging().getToken();
            pushNotification.device_id = fcmToken;
        } catch (error) {
            // alert(error?.message);
            Alert.alert('Attention', 'Sorry, an error occurred when retrieving the notification key ID');
        }
    },

    createChannelId(payload: any) {
        const { channelId, channelName, channelDescription } = payload;
        return PushNotification.createChannel({
            channelId,
            channelName: channelName || 'Notification Server',
            channelDescription: channelDescription || 'Notification description from server',
            importance: Importance.HIGH,
            soundName: 'default',
            vibrate: true
        });
    },

    showNotification(id: any, title: any, message: any, data = {}, options = {}) {
        // if (Platform.OS === 'ios') {
        //     PushNotificationIOS.presentLocalNotification({
        //         alertTitle: title,
        //         alertBody: message,
        //         soundName: 'default',
        //     })
        // } else {
        //     PushNotification.localNotification({
        //         channelId: 'fcm_fallback_notification_channel',
        //         title,
        //         message,
        //         playSound: true, // (optional) default: true
        //         soundName: 'default',
        //         // color: '#EF2932',
        //     });
        // }
        PushNotification.localNotification({
            channelId: 'fcm_fallback_notification_channel',
            title,
            message,
            playSound: true, // (optional) default: true
            soundName: 'default',
            // color: '#EF2932',
        });
    },

    unregister() {
        PushNotification.unregister();
    },

    cancelAllNotification() {
        if (Platform.OS === 'ios') {
            // PushNotificationIOS.removeAllDeliveredNotifications();
        } else {
            PushNotification.cancelAllLocalNotifications();
        }
    },

    removeDeliveredNotificationById(id: any) {
        PushNotification.cancelLocalNotifications({ id: `${id}` });
    },
};

export default pushNotification;