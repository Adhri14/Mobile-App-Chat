import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { signInGoogleAPI, singInAPI } from "../api/auth";
import { colors, fonts } from "../assets/theme";
import BadgeIcon from "../components/BadgeIcon";
import Button from "../components/Button";
import InputText from "../components/InputText";
import useToast from "../hooks/useToast";
import { SignInScreenTypes } from "../router";
import { getDataStorage, setDataStorage } from "../utils/localStorage";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import Line from "../components/Line";

const SignIn = ({ navigation }: SignInScreenTypes) => {
    const { setToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
        deviceToken: '',
    });

    useEffect(() => {
        if (Platform.OS === 'android') {
            GoogleSignin.configure({
                webClientId: '722704378686-q7ftkqiimt35qg5502snfnbo1imcofb1.apps.googleusercontent.com',
            });
        } else if (Platform.OS === 'ios') {
            GoogleSignin.configure({
                iosClientId: '722704378686-31ct4s833n4ctcm1b121khfjakv5de7b.apps.googleusercontent.com',
            });
        }
        // GoogleSignin.configure({
        //     webClientId: '722704378686-q7ftkqiimt35qg5502snfnbo1imcofb1.apps.googleusercontent.com',
        //     iosClientId: '722704378686-31ct4s833n4ctcm1b121khfjakv5de7b.apps.googleusercontent.com',
        // });
        getDataStorage('token_user').then(res => {
            console.log('dasa : ', res);
            if (res !== null) {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            } else {
                setIsLoading(false);
            }
        });
        getDataStorage('device_token').then(res => {
            onHandleChange('deviceToken', res.token || 'asadasdas');
        });
    }, []);

    const onHandleChange = (key: string, value: any) => {
        setForm({
            ...form,
            [key]: value,
        });
    }

    const onSubmit = () => {
        setIsLoading(true);
        setIsLoadingSubmit(true);
        const body = {
            email: form.email,
            password: form.password,
            deviceToken: form.deviceToken || 'asdasdasd',
            typeLogin: 'email-and-password'
        };
        singInAPI(body).then(res => {
            console.log(res);
            setIsLoadingSubmit(false);
            setDataStorage('token_user', { token: res.data });
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
            setIsLoadingSubmit(false);
            setToast({
                isShow: true,
                isError: true,
                title: 'Error',
                message: err.data.message,
            });
        });
    }

    const onGoogleSignIn = async () => {
        setIsLoading(true);
        setIsLoadingSubmit(true);
        try {
            await GoogleSignin.hasPlayServices();
            const result = await GoogleSignin.signIn();
            const accessToken = (await GoogleSignin.getTokens()).accessToken;

            if (result.data?.idToken) {
                const body = {
                    fullName: result.data?.user.name,
                    email: result.data?.user.email,
                    accessToken,
                    deviceToken: form.deviceToken || 'asdasdasd'
                };

                const res = await signInGoogleAPI(body);
                setIsLoadingSubmit(false);
                setDataStorage('token_user', { token: res.data });
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            } else {
                await GoogleSignin.signOut();
            }
        } catch (error) {
            console.log('error login : ', error);
            setIsLoading(false);
            setIsLoadingSubmit(false);
            await GoogleSignin.signOut();
        }
    }

    if (isLoading || isLoadingSubmit) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.textLoading}>Mohon menunggu</Text>
            </View>
        );
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 50, paddingBottom: 30 }}>
                <BadgeIcon src={require('../assets/images/icon-signin.png')} />
                <Text style={styles.title}>Sign In</Text>
                <Text style={styles.subtitle}>Selamat datang di <Text style={{ color: colors.primary, fontWeight: '600' }}>Aplikasi Econify</Text>. Silahkan login terlebih dahulu untuk menikmati <Text style={{ color: colors.primary, fontWeight: '600' }}>Aplikasi Econify</Text>.</Text>
                <InputText
                    label="Email or Username"
                    value={form.email}
                    onChangeText={(value: string) => onHandleChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <InputText
                    label="Password"
                    value={form.password}
                    onChangeText={(value: string) => onHandleChange('password', value)}
                    inputPassword
                />
                <Text style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword')}>Forgot password?</Text>
                <View style={{ height: 32 }} />
                <Button label="Log In" onPress={onSubmit} />
                <Line />
                <Button label="Sign In with Google" onPress={onGoogleSignIn} icon={<Image source={require('../assets/images/ic-google.png')} style={{ width: 24, height: 24, marginRight: 10 }} />} textStyle={{ color: colors.black }} style={{ borderColor: '#ddd', backgroundColor: 'white', borderWidth: 1 }} />
                <Text style={styles.link}>Don’t have account? <Text onPress={() => navigation.navigate('SignUp')} style={styles.bold}>Sign Up</Text></Text>
            </ScrollView>
        </View>
    );
}

export default SignIn;

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textLoading: {
        fontSize: 20,
        fontFamily: fonts.medium,
        color: colors.primaryBold,
        textAlign: 'center',
        marginTop: 10
    },
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 32,
        fontFamily: fonts.bold,
        color: colors.primary,
        textAlign: 'center',
        marginTop: 30,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: fonts.normal,
        color: colors.dark,
        textAlign: 'center',
        marginBottom: 30,
    },
    forgot: {
        fontSize: 14,
        fontFamily: fonts.normal,
        color: colors.dark,
        textAlign: 'right',
    },
    link: {
        fontSize: 14,
        fontFamily: fonts.normal,
        color: colors.dark,
        marginTop: 15
    },
    bold: {
        color: colors.primary,
        fontFamily: fonts.bold
    },
    line: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    divider: {
        height: 1,
        width: '42%',
        backgroundColor: colors.dark
    }
});