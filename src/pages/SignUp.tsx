import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BadgeIcon from "../components/BadgeIcon";
import { colors, fonts } from "../assets/theme";
import InputText from "../components/InputText";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import { SignUpScreenTypes } from "../router";
import { signInGoogleAPI, signUpAPI } from "../api/auth";
import { getDataStorage, setDataStorage } from "../utils/localStorage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Line from "../components/Line";

const SignUp = ({ navigation }: SignUpScreenTypes) => {
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        deviceToken: '',
        isAgree: false,
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
        getDataStorage('device_token').then(res => {
            onHandleChange('deviceToken', res.token || 'abc');
        });
    }, []);

    const onHandleChange = (key: string, value: any) => {
        setForm({
            ...form,
            [key]: value,
        });
    }

    const onSubmit = () => {
        // console.log(form);
        // form.deviceToken = 'abc';
        const body = {
            ...form,
            deviceToken: form.deviceToken || 'asasdasdasd'
        }
        signUpAPI(body).then(res => {
            console.log(res);
            setIsLoadingSubmit(false);
            navigation.replace('VerificationOTP', { email: form.email });
        }).catch(err => {
            setIsLoadingSubmit(false);
            console.log(err);
        })
    }

    const onGoogleSignIn = async () => {
        setIsLoadingSubmit(true);
        try {
            const result = await GoogleSignin.signIn();
            const accessToken = (await GoogleSignin.getTokens()).accessToken;

            const body = {
                fullName: result.data?.user.name,
                email: result.data?.user.email,
                accessToken,
                deviceToken: form.deviceToken || 'asasdadasd'
            };

            const res = await signInGoogleAPI(body);
            setIsLoadingSubmit(false);
            setDataStorage('token_user', { token: res.data });
            // navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            navigation.replace('Home');

        } catch (error) {
            console.log('error login : ', error);
            setIsLoadingSubmit(false);
            await GoogleSignin.signOut();
        }
    }

    if (isLoadingSubmit) {
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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : undefined} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 50, paddingBottom: 30 }}>
                    <BadgeIcon src={require('../assets/images/icon-signup.png')} />
                    <Text style={styles.title}>Sign Up</Text>
                    <Text style={styles.subtitle}>Selamat datang di <Text style={{ color: colors.primary, fontWeight: '600' }}>Aplikasi Econify</Text>. Daftar terlebih dahulu untuk menikmati <Text style={{ color: colors.primary, fontWeight: '600' }}>Aplikasi Econify</Text>.</Text>
                    <InputText
                        label="Full name"
                        value={form.fullName}
                        onChangeText={(value: string) => onHandleChange('fullName', value)}
                    />
                    <InputText
                        label="Username"
                        value={form.username}
                        onChangeText={(value: string) => onHandleChange('username', value)}
                    />
                    <InputText
                        label="Email"
                        value={form.email}
                        onChangeText={(value: string) => onHandleChange('email', value)}
                        keyboardType="email-address"
                    />
                    <InputText
                        label="Password"
                        value={form.password}
                        onChangeText={(value: string) => onHandleChange('password', value)}
                        inputPassword
                    />
                    <Checkbox
                        value={form.isAgree}
                        onValueChange={() => onHandleChange('isAgree', !form.isAgree)}
                    />
                    <View style={{ height: 32 }} />
                    <Button label="Create Account" onPress={onSubmit} />
                    <Line />
                    <Button label="Sign Up with Google" onPress={onGoogleSignIn} icon={<Image source={require('../assets/images/ic-google.png')} style={{ width: 24, height: 24, marginRight: 10 }} />} textStyle={{ color: colors.black }} style={{ borderColor: '#ddd', backgroundColor: 'white', borderWidth: 1 }} />
                    <Text style={styles.link}>Do you have account? <Text onPress={() => navigation.navigate('SignIn')} style={styles.bold}>Sign In</Text></Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

export default SignUp;

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
    link: {
        fontSize: 14,
        fontFamily: fonts.normal,
        color: colors.dark,
        marginTop: 15
    },
    bold: {
        color: colors.primary,
        fontFamily: fonts.bold
    }
});