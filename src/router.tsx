import React from "react"
import { StackHeaderProps, StackScreenProps, createStackNavigator } from "@react-navigation/stack";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import Home from "./pages/Home.tsx";
import { ParamListBase } from "@react-navigation/native";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Header from "./components/Header/index.tsx";
import ChatRoom from "./pages/ChatRoom.tsx";
import VerificationOTP from "./pages/VerificationOTP.tsx";
import Setting from "./pages/Setting.tsx";

const Stack = createStackNavigator();

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    Home: undefined;
    ForgotPassword: undefined;
    VerificationOTP: { email: string };
    ChatRoom: undefined;
    Setting: undefined;
}

export type SignInScreenTypes = StackScreenProps<ParamListBase, 'SignIn'>;
export type SignUpScreenTypes = StackScreenProps<ParamListBase, 'SignUp'>;
export type HomeScreenTypes = StackScreenProps<ParamListBase, 'Home'>;
export type ForgotPasswordScreenTypes = StackScreenProps<ParamListBase, 'ForgotPassword'>;
export type VerificationOTPScreenTypes = StackScreenProps<ParamListBase, 'VerificationOTP'>;
export type ChatRoomScreenTypes = StackScreenProps<ParamListBase, 'ChatRoom'>;
export type SettingScreenTypes = StackScreenProps<ParamListBase, 'Setting'>;

const Router = () => {
    return (
        <Stack.Navigator screenOptions={{ header: () => null }}>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="VerificationOTP" component={VerificationOTP} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ChatRoom" component={ChatRoom} />
            <Stack.Screen name="Setting" component={Setting} />
        </Stack.Navigator>
    );
}

export default Router;
