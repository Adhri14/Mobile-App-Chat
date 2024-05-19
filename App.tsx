import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./src/router.tsx";
import { NativeModules, Platform } from "react-native";
import { navigationRef } from "./src/utils/navigationRef.ts";

const App = () => {
    return (
        <NavigationContainer ref={navigationRef} onReady={() => Platform.OS === 'android' && NativeModules.SplashScreenModule?.hide()}>
            <Router />
        </NavigationContainer>
    );
}

export default App;
