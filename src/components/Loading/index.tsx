import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, useWindowDimensions } from "react-native";
import { colors, fonts } from "../../assets/theme";
import { Platform } from "react-native";

export default function Loading({ fadeAnim, isLoading }: { fadeAnim: any, isLoading: boolean }) {
    const { width, height } = useWindowDimensions();
    const [show, setShow] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            if (!isLoading) {
                setShow(false);
            }
        }, 1200);
    }, [isLoading]);

    return (
        <Animated.View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', opacity: fadeAnim, position: 'absolute', zIndex: 1, width, height, backfaceVisibility: isLoading ? 'visible' : 'hidden', display: show ? 'flex' : 'none' }}>
            <LottieView
                source={require("../../assets/lotties/Animation-2.json")}
                style={{ width: "100%", height: "20%", marginTop: Platform.OS === 'ios' ? -100 : 0 }}
                autoPlay
                loop
            />
            <Text style={{ fontSize: 20, fontFamily: fonts.bold, color: colors.black, marginTop: -50 }}>Loading</Text>
        </Animated.View>
    );
}