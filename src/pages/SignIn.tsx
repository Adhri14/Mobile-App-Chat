import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../assets/theme";
import BadgeIcon from "../components/BadgeIcon";
import Button from "../components/Button";
import InputText from "../components/InputText";
import { SignInScreenTypes } from "../router";

const SignIn = ({ navigation }: SignInScreenTypes) => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const onHandleChange = (key: string, value: any) => {
        setForm({
            ...form,
            [key]: value,
        });
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
                <Button label="Log In" onPress={() => navigation.replace('Home')} />
                <Text style={styles.link}>Don’t have account? <Text onPress={() => navigation.navigate('SignUp')} style={styles.bold}>Sign Up</Text></Text>
            </ScrollView>
        </View>
    );
}

export default SignIn;

const styles = StyleSheet.create({
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