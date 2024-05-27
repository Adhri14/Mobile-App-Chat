import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, StatusBar, FlatList, useWindowDimensions, Dimensions } from "react-native";
import BadgeIcon from "../components/BadgeIcon";
import { colors, fonts } from "../assets/theme";
import InputText from "../components/InputText";
import Button from "../components/Button";
import { ForgotPasswordScreenTypes, VerificationOTPScreenTypes } from "../router";
import Header from "../components/Header";
import { resendOTPAPI, verficationAPI } from "../api/auth";
import { setDataStorage } from "../utils/localStorage";

const { width } = Dimensions.get('window');

const VerificationOTP = ({ navigation, route }: VerificationOTPScreenTypes) => {
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const { email }: { email: string } = route.params;

    const [form, setForm] = useState({
        email,
        otp: '',
    });

    const onHandleChange = (key: string, value: string) => {
        setForm({
            ...form,
            [key]: value,
        });
    }

    const onSubmit = () => {
        setIsLoadingSubmit(true);
        verficationAPI(form).then(res => {
            setIsLoadingSubmit(false);
            navigation.replace('SignIn');
        }).catch(err => {
            setIsLoadingSubmit(false);
            console.log(err);
        })
    }

    const resendOTP = () => {
        resendOTPAPI({ email }).then(res => {
            console.log(res);
            onHandleChange('otp', '');
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <View style={styles.container}>
                <BadgeIcon src={require('../assets/images/icon-email.png')} />
                <Text style={styles.title}>Enter OTP</Text>
                <View style={{ height: 30 }} />
                <InputText value={form.otp} onChangeText={(value: string) => onHandleChange('otp', value)} label="Enter OTP" />
                <Button label="Continue" onPress={onSubmit} />
                <Text style={styles.link}>Didn't get OTP? <Text onPress={resendOTP} style={styles.bold}>Resend OTP</Text></Text>
            </View>
        </View>
    );
}

export default VerificationOTP;

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
    container: {
        flex: 1,
        width,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    wrapperIndicator: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 70
    },
    indicator: {
        height: 4,
        borderRadius: 4,
        width: 32,
        backgroundColor: colors.primarySoft,
        marginHorizontal: 5,
    },
    title: {
        fontSize: 32,
        fontFamily: fonts.bold,
        color: colors.primary,
        textAlign: 'center',
        marginTop: 30,
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