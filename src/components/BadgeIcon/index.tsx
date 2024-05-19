import React from "react";
import { Image, ImageURISource, StyleSheet, View } from "react-native";
import { colors } from "../../assets/theme";

type BadgeIconTypes = {
    src: ImageURISource,
}

const BadgeIcon = ({ src }: BadgeIconTypes) => {
    return (
        <View style={styles.container}>
            <Image source={src} style={styles.image} />
        </View>
    );
}

export default BadgeIcon;

const styles = StyleSheet.create({
    container: {
        width: 90,
        height: 90,
        backgroundColor: colors.primarySoft,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        alignSelf: 'center',
    },
    image: {
        width: 70,
        height: 70,
    }
});