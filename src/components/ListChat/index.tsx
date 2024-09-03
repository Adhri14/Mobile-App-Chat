import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { colors, fonts } from "../../assets/theme";
import HighlightText from "../HiglightText";

type ListChatTypes = {
    isMe?: boolean;
    message?: string;
    time?: string;
    statusRead?: boolean;
}

const ListChat = ({ isMe, message, time, statusRead }: ListChatTypes) => {

    if (isMe) {
        return (
            <View style={styles.containerIsMe}>
                {/* <Text style={styles.message}>{message}</Text> */}
                <HighlightText text={message} />
                <View style={styles.lastSeen}>
                    <Text style={styles.time}>{time}</Text>
                    <Image source={statusRead ? require('../../assets/images/icon-check-double.png') : require('../../assets/images/icon-check.png')} style={styles.iconLastSeen} />
                </View>
            </View>
        );
    }
    return (
        <View style={styles.containerOther}>
            {/* <Text style={styles.message}>{message}</Text> */}
            <HighlightText text={message} />
            <View style={styles.lastSeen}>
                <Text style={styles.time}>{time}</Text>
                {/* <Image source={statusRead ? require('../../assets/images/icon-check-double.png') : require('../../assets/images/icon-check.png')} style={styles.iconLastSeen} /> */}
            </View>
        </View>
    );
}

export default ListChat;

const styles = StyleSheet.create({
    containerOther: {
        backgroundColor: colors.gray,
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        padding: 10,
        maxWidth: '90%',
        alignSelf: 'flex-start',
        marginBottom: 10
    },
    containerIsMe: {
        backgroundColor: colors.primarySoft,
        borderRadius: 20,
        borderBottomRightRadius: 0,
        padding: 10,
        maxWidth: '90%',
        alignSelf: 'flex-end',
        marginBottom: 10
    },
    message: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.black
    },
    time: {
        color: colors.black,
        fontSize: 10,
        fontFamily: fonts.normal,
        marginTop: 5,
        textAlign: 'right',
    },
    lastSeen: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    iconLastSeen: {
        width: 20,
        height: 20,
        marginTop: 2,
        marginLeft: 2
    }
});