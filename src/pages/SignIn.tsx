import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../assets/theme";
import BadgeIcon from "../components/BadgeIcon";
import Button from "../components/Button";
import InputText from "../components/InputText";
import { SignInScreenTypes } from "../router";
import { singInAPI } from "../api/auth";
import { clearDataStorage, getDataStorage, setDataStorage } from "../utils/localStorage";

const SignIn = ({ navigation }: SignInScreenTypes) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        getDataStorage('token_user').then(res => {
            if (res) {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            } else {
                setIsLoading(false);
            }
        });
    }, [])

    const onHandleChange = (key: string, value: any) => {
        setForm({
            ...form,
            [key]: value,
        });
    }

    const onSubmit = () => {
        setIsLoading(true);
        singInAPI(form).then(res => {
            console.log(res);
            setIsLoadingSubmit(false);
            setDataStorage('token_user', { token: res.data });
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }).catch(err => {
            setIsLoading(false);
            console.log(err);
        })
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
                <Text style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword')}>Forgot password?</Text>
                <View style={{ height: 32 }} />
                <Button label="Log In" onPress={onSubmit} />
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
    }
});