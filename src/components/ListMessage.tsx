import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { colors, fonts } from "../assets/theme";

const ListMessage = () => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>Adhri</Text>
                <Text style={styles.message} numberOfLines={1}>Halo apa kabar semua</Text>
            </View>
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.time}>10.11</Text>
                <View style={styles.newMessage}>
                    <Text style={styles.textNewMessage}>1</Text>
                </View>
            </View>
        </View>
    );
}

export default ListMessage;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 15,
        resizeMode: 'cover',
        marginRight: 16
    },
    name: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: colors.black
    },
    message: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.dark2
    },
    time: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.dark2,
        textAlign: 'right',
        marginBottom: 5
    },
    newMessage: {
        width: 20,
        height: 20,
        backgroundColor: colors.primarySoft,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end'
    },
    textNewMessage: {
        fontSize: 12,
        fontFamily: fonts.medium,
        color: colors.primaryBold,
        lineHeight: 16
    },
});