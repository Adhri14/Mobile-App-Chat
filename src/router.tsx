import React from "react"
import { CardStyleInterpolators, StackHeaderProps, StackScreenProps, TransitionSpecs, createStackNavigator } from "@react-navigation/stack";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import Home from "./pages/Home.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Header from "./components/Header/index.tsx";
import ChatRoom from "./pages/ChatRoom.tsx";
import VerificationOTP from "./pages/VerificationOTP.tsx";
import Profile, { ProfileStateType } from "./pages/Profile.tsx";
import UpdateProfile from "./pages/UpdateProfile.tsx";
import ListUsers from "./pages/ListUsers.tsx";
import { Platform } from "react-native";
import ListUser from "./pages/ListUser.tsx";

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    Home: undefined;
    ForgotPassword: undefined;
    VerificationOTP: { email: string };
    ChatRoom: { profile?: ProfileStateType, chatId: string };
    Profile: { logout?: boolean; userId: string; };
    UpdateProfile: undefined;
    ListUsers: undefined;
    ListUser: { initialRouteIndex: number, username: string, userId: string };
}

export type SignInScreenTypes = StackScreenProps<RootStackParamList, 'SignIn'>;
export type SignUpScreenTypes = StackScreenProps<RootStackParamList, 'SignUp'>;
export type HomeScreenTypes = StackScreenProps<RootStackParamList, 'Home'>;
export type ForgotPasswordScreenTypes = StackScreenProps<RootStackParamList, 'ForgotPassword'>;
export type VerificationOTPScreenTypes = StackScreenProps<RootStackParamList, 'VerificationOTP'>;
export type ChatRoomScreenTypes = StackScreenProps<RootStackParamList, 'ChatRoom'>;
export type ProfileScreenTypes = StackScreenProps<RootStackParamList, 'Profile'>;
export type UpdateProfileScreenTypes = StackScreenProps<RootStackParamList, 'UpdateProfile'>;
export type ListUsersScreenTypes = StackScreenProps<RootStackParamList, 'ListUsers'>;
export type ListUserScreenTypes = StackScreenProps<RootStackParamList, 'ListUser'>;

const Stack = createStackNavigator<RootStackParamList>();

const Router = () => {

    return (
        <Stack.Navigator screenOptions={{ header: () => null, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="VerificationOTP" component={VerificationOTP} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ChatRoom" component={ChatRoom} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="UpdateProfile" component={UpdateProfile} options={{ presentation: Platform.OS === 'ios' ? 'modal' : 'card' }} />
            <Stack.Screen name="ListUsers" component={ListUsers} options={{ presentation: Platform.OS === 'ios' ? 'modal' : 'card' }} />
            <Stack.Screen name="ListUser" component={ListUser} options={{ presentation: Platform.OS === 'ios' ? 'modal' : 'card' }} />
            {/* <Stack.Group>
                
            </Stack.Group> */}
            {/* <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
                <Stack.Screen name="ListUsers" component={ListUsers} />
            </Stack.Group> */}
        </Stack.Navigator>
    );
}

export default Router;
