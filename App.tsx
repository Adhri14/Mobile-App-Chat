import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./src/router.tsx";
import { NativeModules, Platform } from "react-native";

const App = () => {
    return (
        <NavigationContainer onReady={() => Platform.OS === 'android' && NativeModules.SplashScreenModule?.hide()}>
            <Router />
        </NavigationContainer>
    );
}

export default App;
