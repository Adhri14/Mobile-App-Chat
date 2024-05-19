import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import BadgeIcon from "../components/BadgeIcon";
import { colors, fonts } from "../assets/theme";
import InputText from "../components/InputText";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import { SignUpScreenTypes } from "../router";

const SignUp = ({ navigation }: SignUpScreenTypes) => {
    const [form, setForm] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        isAgree: false,
    });

    const onHandleChange = (key: string, value: any) => {
        setForm({
            ...form,
            [key]: value,
        });
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor="white" />
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
                    keyboardType="number-pad"
                    inputPassword
                />
                <Checkbox
                    value={form.isAgree}
                    onValueChange={() => onHandleChange('isAgree', !form.isAgree)}
                />
                <View style={{ height: 32 }} />
                <Button label="Create Account" onPress={() => null} />
                <Text style={styles.link}>Do you have account? <Text onPress={() => navigation.navigate('SignIn')} style={styles.bold}>Sign In</Text></Text>
            </ScrollView>
        </View>
    );
}

export default SignUp;

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