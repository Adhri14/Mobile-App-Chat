import React, { useRef, useState } from "react";
import { Dimensions, FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { forgotPasswordAPI, resendOTPAPI } from "../api/auth";
import { colors, fonts } from "../assets/theme";
import BadgeIcon from "../components/BadgeIcon";
import Button from "../components/Button";
import Header from "../components/Header";
import InputText from "../components/InputText";
import { ForgotPasswordScreenTypes } from "../router";

const { width } = Dimensions.get('window');

const ForgotPassword = ({ navigation }: ForgotPasswordScreenTypes) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [form, setForm] = useState({
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });

    const onHandleChange = (key: string, value: string) => {
        setForm({
            ...form,
            [key]: value,
        });
    }

    const resendOTP = () => {
        resendOTPAPI({ email: form.email }).then(res => {
            console.log(res);
            onHandleChange('otp', '');
        }).catch(err => {
            console.log(err);
        })
    }

    const onSubmit = () => {
        if (currentIndex === 0) {
            resendOTPAPI({ email: form.email }).then(res => {
                console.log(res);
                flatListRef.current?.scrollToIndex({ animated: true, index: 1 });
            }).catch(err => {
                console.log(err);
            })
        }
        if (currentIndex === 1) {
            onHandleChange('otp', '');
            flatListRef.current?.scrollToEnd({ animated: true });
        }
        if (currentIndex === 2) {
            forgotPasswordAPI(form).then(res => {
                console.log(res.data);
                navigation.replace('SignIn');
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const ContainerComponents = [
        {
            id: 'screen-1',
            component: (
                <View style={styles.container}>
                    <BadgeIcon src={require('../assets/images/icon-email.png')} />
                    <Text style={styles.title}>Forget Password</Text>
                    <View style={{ height: 30 }} />
                    <InputText value={form.email} onChangeText={(value: string) => onHandleChange('email', value)} label="Email/Username" />
                    <Button label="Continue" onPress={onSubmit} />
                </View>
            )
        },
        {
            id: 'screen-2',
            component: (
                <View style={styles.container}>
                    <BadgeIcon src={require('../assets/images/icon-email.png')} />
                    <Text style={styles.title}>Enter OTP</Text>
                    <View style={{ height: 30 }} />
                    <InputText value={form.otp} onChangeText={(value: string) => onHandleChange('otp', value)} label="Enter OTP" />
                    <Button label="Continue" onPress={() => flatListRef.current?.scrollToIndex({ animated: true, index: 2 })} />
                    <Text style={styles.link}>Didn't get OTP? <Text onPress={resendOTP} style={styles.bold}>Resend OTP</Text></Text>
                </View>
            )
        },
        {
            id: 'screen-3',
            component: (
                <View style={styles.container}>
                    <BadgeIcon src={require('../assets/images/icon-password.png')} />
                    <Text style={styles.title}>Reset Password</Text>
                    <View style={{ height: 30 }} />
                    <InputText value={form.password} inputPassword onChangeText={(value: string) => onHandleChange('password', value)} label="New Password" />
                    <InputText value={form.confirmPassword} inputPassword onChangeText={(value: string) => onHandleChange('confirmPassword', value)} label="Confirm Password" />
                    <Button label="Continue" onPress={onSubmit} />
                </View>
            )
        },
    ];

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Header onPress={() => currentIndex === 0 ? navigation.goBack() : flatListRef.current?.scrollToIndex({ animated: true, index: currentIndex - 1 })} />
            <View style={styles.wrapperIndicator}>
                {ContainerComponents.map((_: any, index: number) => {
                    console.log('cek index : ', index);
                    console.log('current : ', currentIndex);
                    return (
                        <View key={index} style={[styles.indicator, { backgroundColor: index === currentIndex ? colors.primary : colors.primarySoft }]} />
                    );
                })}
            </View>
            <FlatList
                ref={flatListRef}
                data={ContainerComponents}
                keyExtractor={item => item.id}
                renderItem={({ item }) => item.component}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={({ viewableItems }) => {
                    setCurrentIndex(Number(viewableItems[0].index));
                }}
            // scrollEnabled={false}
            />
        </View>
    );
}

export default ForgotPassword;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        width,
        paddingHorizontal: 24
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